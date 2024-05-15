import typing

from django.conf import settings
from django.contrib.auth import get_user_model

from apps.common.email import render_translated_email, send_html_email
from apps.company.models import AdditionalInvoiceRecipient
from apps.packaging_report.models import PackagingReport

UserModel = get_user_model()


def send_packaging_report_invoice(
    user: UserModel,
    packaging_report: PackagingReport,
    additional_invoice_recipient: typing.Optional[AdditionalInvoiceRecipient],
):
    """
    Sends a packaging report invoice.
    """
    assert user is not None
    assert packaging_report.invoice_file.url
    context = {
        'user': user,
        'packaging_report_id': packaging_report.id,
        'url': packaging_report.invoice_file.url,
        'frontend_url': settings.FRONTEND_URL,
    }
    invoice_recipient_email = additional_invoice_recipient.email if additional_invoice_recipient else user.email
    subject, body_plain, body_html = render_translated_email('invoice', user.language_preference, context)
    send_html_email(
        subject=subject,
        body_plain=body_plain,
        body_html=body_html,
        to=[invoice_recipient_email],
        cc=[user.email] if invoice_recipient_email else None,
    )
