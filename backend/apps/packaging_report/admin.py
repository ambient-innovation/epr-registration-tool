from django import forms
from django.conf.locale.es import formats as es_formats
from django.contrib import admin, messages
from django.db.models import Case, CharField, F, Value, When
from django.http import HttpResponseRedirect
from django.urls import path
from django.utils import timezone
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _

import pytz
from ai_django_core.admin.model_admins.mixins import CommonInfoAdminMixin

from common.models import Month
from packaging_report.models import (
    FinalSubmission,
    ForecastSubmission,
    MaterialRecord,
    PackagingReport,
    ReportSubmission,
)
from packaging_report.views import CSVExportDataView

es_formats.DATETIME_FORMAT = "d M Y H:i:s"


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

    def has_module_permission(self, request):
        return False


@admin.register(FinalSubmission)
class FinalSubmissionAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'fees', 'created_at')
    fields = (
        'related_report',
        'estimated_fees_display',
    )
    readonly_fields = ('estimated_fees_display',)
    inlines = (MaterialRecordInline,)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('related_report')

    def has_change_permission(self, request, obj=None):
        return False

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)
        instance = form.instance
        instance.fees = ReportSubmission.calculate_fees(
            instance.related_report, instance.material_records_queryset.all()
        )
        instance.save()

    def has_module_permission(self, request):
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


class MonthFilter(admin.SimpleListFilter):
    title = _('Month')
    parameter_name = 'month'

    def lookups(self, request, model_admin):
        return Month.choices

    def queryset(self, request, queryset):
        try:
            value = self.value()
            if value and int(value) in Month:
                return queryset.annotate(end_month=F('start_month') + F('timeframe') - 1).filter(
                    start_month__lte=value,
                    end_month__gte=value,
                )
        except ValueError:
            pass

        return queryset


class StatusFilter(admin.SimpleListFilter):
    title = _('Status')
    parameter_name = 'status'

    def lookups(self, request, model_admin):
        return (
            ('forecast', _('Forecast')),
            ('payment-required', _('Payment required')),
            ('paid', _('Paid')),
            ('no-submission', _('No data')),
        )

    def queryset(self, request, queryset):
        value = self.value()
        if value is not None:
            if value == 'no-submission':
                return queryset.filter(status__isnull=True)
            else:
                return queryset.filter(status=value)
        return queryset


@admin.register(PackagingReport)
class PackagingReportAdmin(CommonInfoAdminMixin, admin.ModelAdmin):
    change_form_template = 'packaging_report/change_view.html'
    change_list_template = 'packaging_report/change_list.html'
    form = PackagingReportForm
    list_display = (
        '__str__',
        'company_name',
        'year',
        'start_month',
        'timeframe',
        'end_month',
        'status',
    )
    search_fields = (
        'company_name',
        'year',
        'status',
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
        'end_datetime_display',
        'is_forecast_editable',
        'related_forecast',
        'related_final_submission',
        'is_paid',
        'status',
        'invoice_file',
    )
    add_fields = (
        'related_company',
        'year',
        'start_month',
        'timezone_info',
        'timeframe',
        'lastmodified_by',
        'created_by',
        'created_at',
        'lastmodified_at',
    )
    autocomplete_fields = ('related_company',)
    list_filter = (
        StatusFilter,
        'year',
        'timeframe',
        MonthFilter,
    )
    readonly_fields = (
        'invoice_file',
        'is_paid',
        'related_forecast',
        'end_datetime_display',
        'is_forecast_editable',
        'related_final_submission',
        'lastmodified_by',
        'created_by',
        'created_at',
        'lastmodified_at',
        'status',
    )

    class Media:
        css = {'all': ('packaging_report/admin.css',)}

    def response_change(self, request, obj):
        if "_mark_as_paid" in request.POST:
            if obj.status == 'payment-required':
                obj.is_paid = True
                obj.save()
                messages.success(request, _('Marked as paid successfully.'))
            else:
                messages.error(request, _('Payment is not required yet.'))
            return HttpResponseRedirect('.')
        if '_revert_mark_as_paid' in request.POST:
            obj.is_paid = False
            obj.save()
            return HttpResponseRedirect('.')
        return super().response_change(request, obj)

    def get_fields(self, request, obj=None):
        # in add form we don't need all fields
        if not obj:
            return self.add_fields
        else:
            return self.fields

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .prefetch_related('related_forecast', 'related_final_submission')
            .annotate(company_name=F('related_company__name'))
            .annotate(
                status=Case(
                    When(is_paid=True, then=Value('paid')),
                    When(related_final_submission__isnull=False, then=Value('payment-required')),
                    When(related_forecast__isnull=False, then=Value('forecast')),
                    output_field=CharField(),
                    default=None,
                ),
            )
        )

    @admin.display(description='End month')
    def end_month(self, obj: PackagingReport):
        end_month = obj.start_month + obj.timeframe - 1
        try:
            return Month.labels[end_month - 1]
        except IndexError:
            return 'n.a.'

    @admin.display(description='Company')
    def company_name(self, obj):
        return obj.company_name

    @admin.display(description='Status', ordering='status')
    def status(self, obj: PackagingReport):
        status = getattr(obj, 'status')  # <-- annotated
        if status == 'forecast':
            label = _('Forecast')
        elif status == 'payment-required':
            label = _('Payment required')
        elif status == 'paid':
            label = _('Paid')
        else:
            label = _('no data')
        return format_html(
            '<span class="status-badge {extra_class}"><span>{label}</span></div>',
            label=label,
            extra_class=f"status-badge--{status}" if status else '',
        )

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                'export/',
                self.admin_site.admin_view(CSVExportDataView.as_view()),
                name='export_reports_data',
            )
        ]
        return custom_urls + urls


@admin.register(MaterialRecord)
class MaterialRecordAdmin(CommonInfoAdminMixin, admin.ModelAdmin):
    fields = (
        "related_forecast_submission",
        'related_final_submission',
        'related_packaging_group',
        'related_packaging_material',
        'quantity',
    )

    list_filter = (
        'related_packaging_group',
        'related_packaging_material',
    )

    def has_change_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request, obj=None):
        return False

    def has_module_permission(self, request):
        return False
