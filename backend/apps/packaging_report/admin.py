from django import forms
from django.contrib import admin
from django.utils import timezone

import pytz
from ai_django_core.admin.model_admins.mixins import CommonInfoAdminMixin
from dateutil.relativedelta import relativedelta

from packaging_report.models import FinalSubmission, ForecastSubmission, MaterialRecord, PackagingReport


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
    change_form_template = 'packaging_report/forecast_change_view.html'

    list_display = ('__str__', 'created_at')
    fields = (
        'related_report',
        'estimated_fees_display',
    )
    readonly_fields = ('estimated_fees_display',)
    inlines = (MaterialRecordInline,)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('related_report')

    def has_change_permission(self, request, obj=None):
        return obj.related_report.is_forecast_editable() if obj else True


@admin.register(FinalSubmission)
class FinalSubmissionAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'fees', 'created_at')
    fields = (
        'related_report',
        'fees',
    )
    readonly_fields = ('fees',)
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
    timezone_info = forms.ChoiceField(
        choices=[(timezone, timezone) for timezone in pytz.common_timezones],
    )

    def __init__(self, *args, **kwargs):
        if 'instance' not in kwargs:
            if 'initial' not in kwargs:
                kwargs['initial'] = {}
            kwargs['initial'].update({'start_month': self.now.month})
        super().__init__(*args, **kwargs)


@admin.register(PackagingReport)
class PackagingReportAdmin(CommonInfoAdminMixin, admin.ModelAdmin):
    change_form_template = 'packaging_report/change_view.html'
    form = PackagingReportForm
    list_display = (
        '__str__',
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
        'end_date',
        'is_forecast_editable',
        'related_final_submission',
    )
    autocomplete_fields = ('related_company',)
    list_filter = ('timeframe',)
    readonly_fields = (
        'related_forecast',
        'end_date',
        'is_forecast_editable',
        'related_final_submission',
        'lastmodified_by',
        'created_by',
        'created_at',
        'lastmodified_at',
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('related_forecast')

    def has_change_permission(self, request, obj=None):
        return obj.is_forecast_editable() if obj else True

    @admin.display(description="End date")
    def end_date(self, obj):
        """
        Report end datetime in server timezone
        """
        if obj.pk:
            start_date = timezone.datetime(
                year=obj.year,
                month=obj.start_month,
                day=1,
            )
            end_date = start_date + relativedelta(months=obj.timeframe)
            return end_date
        return None
