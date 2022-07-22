from django.db.models import Prefetch

from dateutil.relativedelta import relativedelta

from account.models import User
from common.pdf_generate import PDFService
from packaging_report.invoice import InvoiceService
from packaging_report.models import PackagingReport


class InvoicePdf(PDFService):
    def __init__(self, packaging_report_id, user_id):
        self.user = User.objects.filter(pk=user_id).select_related('related_company').first()
        self.packaging_report = (
            PackagingReport.objects.visible_for(self.user)
            .filter(pk=packaging_report_id)
            .prefetch_related(
                Prefetch('related_final_submission', to_attr='final_submission'),
                Prefetch('final_submission__material_records_queryset', to_attr='material_records'),
                Prefetch(
                    'final_submission__material_records__related_packaging_material', to_attr='packaging_material'
                ),
                Prefetch('final_submission__material_records__related_packaging_group', to_attr='packaging_group'),
            )
            .first()
        )

        self.company = self.user.related_company
        assert getattr(self.packaging_report, 'final_submission', None) is not None, 'Final submission does not exists.'
        self.final_submission = self.packaging_report.final_submission

    def _get_context_data(self):
        context = super()._get_context_data()
        invoice_service = InvoiceService(
            self.packaging_report.timeframe,
            self.packaging_report.year,
            self.packaging_report.start_month,
            self.final_submission,
        )
        context.update(
            company=self.company,
            invoice_no=invoice_service.invoice_id(self.packaging_report.id),
            company_address=self.company.related_contact_info.address_line,
            contact_person=self.user,
            invoice_date=self.packaging_report.final_submission.created_at,
            invoice_due_date=self.packaging_report.final_submission.created_at + relativedelta(days=30),
            material_records_frames=invoice_service.clean_material_records(),
            total_fees=invoice_service.get_total_fees(),
            tax='19%',  # placeholder
            currancy='JOD',
        )
        return context

    def _get_filename(self):
        name = (f'Data Report No. {self.packaging_report.id} invoice',)
        return name

    def _get_template(self) -> str:
        return 'invoice/en/invoice.html'
