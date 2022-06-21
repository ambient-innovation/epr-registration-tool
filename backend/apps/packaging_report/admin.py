from django import forms
from django.contrib import admin
from django.utils import timezone

from ai_django_core.admin.model_admins.mixins import CommonInfoAdminMixin

from packaging_report.models import ForecastSubmission, MaterialRecord, PackagingReport


class MaterialRecordInline(admin.StackedInline):
    model = MaterialRecord
    extra = 0
    min_num = 1
    fields = (
        'quantity',
        'related_packaging_group',
        'related_packaging_material',
    )


@admin.register(ForecastSubmission)
class ForecastSubmissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'created_at')
    fields = (
        'related_report',
        'estimated_fees',
    )
    readonly_fields = ('estimated_fees',)
    inlines = (MaterialRecordInline,)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('related_report')

    def has_change_permission(self, request, obj=None):
        return False


class PackagingReportForm(forms.ModelForm):
    YEAR_CHOICES = []
    now = timezone.now()
    current_year = now.year
    # this project starts on 2022, so it cannot be that there is report before 2021
    for r in range(2021, current_year + 5):
        YEAR_CHOICES.append((r, r))
    year = forms.CharField(
        max_length=4,
        widget=forms.Select(choices=YEAR_CHOICES),
    )

    def __init__(self, *args, **kwargs):
        if 'instance' not in kwargs:
            if 'initial' not in kwargs:
                kwargs['initial'] = {}
            kwargs['initial'].update({'start_month': self.now.month})
        super().__init__(*args, **kwargs)


@admin.register(PackagingReport)
class PackagingReportAdmin(CommonInfoAdminMixin, admin.ModelAdmin):
    form = PackagingReportForm
    list_display = (
        'id',
        'timeframe',
        'year',
        'start_month',
    )
    fields = (
        'related_company',
        'year',
        'start_month',
        'timezone_info',
        'timeframe',
        'lastmodified_by',
        'created_by',
        'created_at',
        'lastmodified_at',
        'related_forecast',
    )
    autocomplete_fields = ('related_company',)
    list_filter = ('timeframe',)
    readonly_fields = (
        'related_forecast',
        'lastmodified_by',
        'created_by',
        'created_at',
        'lastmodified_at',
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('related_forecast')
