from django.contrib import admin

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
    fields = ('related_report',)
    inlines = (MaterialRecordInline,)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('related_report')


@admin.register(PackagingReport)
class PackagingReportAdmin(admin.ModelAdmin):
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
