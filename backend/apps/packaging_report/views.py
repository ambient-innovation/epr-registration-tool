from django.contrib import messages
from django.db.models import Prefetch
from django.utils.translation import gettext_lazy as _
from django.views import generic

from common.mixin import AdminViewMixin
from packaging_report.forms import CSVExportDataForm
from packaging_report.models import PackagingReport, ReportTypes


class CSVExportDataView(AdminViewMixin, generic.FormView):
    model = PackagingReport
    template_name = 'packaging_report/export_packaging_reports.html'
    form_class = CSVExportDataForm

    success_url = '/admin/packaging_report/packagingreport/export/'

    @staticmethod
    def get_reports_in_timeframe(year, from_month, to_month, report_type):
        base_qs = (
            PackagingReport.objects.annotate_end_month()
            .filter(year=year)
            .filter(start_month__lte=to_month, end_month__gte=from_month)
        )

        return (
            base_qs.filter(related_forecast__isnull=False).prefetch_related(
                Prefetch('related_company', to_attr='company'),
                Prefetch('related_forecast', to_attr='forecast'),
                Prefetch('forecast__material_records_queryset', to_attr='material_records'),
                Prefetch('forecast__material_records__related_packaging_material', to_attr='material'),
                Prefetch('forecast__material_records__related_packaging_group', to_attr='packaging_group'),
            )
            if int(report_type) == ReportTypes.FORCAST
            else base_qs.filter(related_final_submission__isnull=False).prefetch_related(
                Prefetch('related_company', to_attr='company'),
                Prefetch('related_final_submission', to_attr='final_submission'),
                Prefetch('final_submission__material_records_queryset', to_attr='material_records'),
                Prefetch('final_submission__material_records__related_packaging_material', to_attr='material'),
                Prefetch('final_submission__material_records__related_packaging_group', to_attr='packaging_group'),
            )
        )

    def form_valid(self, form):
        """A view that streams a large CSV file."""
        covered_reports = self.get_reports_in_timeframe(**form.cleaned_data)
        covered_reports_count = len(covered_reports)
        if not covered_reports_count:
            messages.error(
                self.request,
                _(
                    f'Selected Timeframe contains no '
                    f'{ReportTypes.get_label_by_value(int(form.cleaned_data["report_type"]))} Reports'
                ),
            )
            return self.render_to_response(self.get_context_data())

        response = form.export_to_csv(**form.cleaned_data, reports=covered_reports)

        return response

    def get_context_data(self, **kwargs):
        return super().get_context_data(**kwargs)
