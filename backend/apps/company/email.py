from urllib.parse import urljoin

from django.conf import settings
from django.contrib.auth import get_user_model
from django.urls import reverse

from sentry_sdk import capture_message

from common.email import render_email, render_translated_email, send_html_email

UserModel = get_user_model()


def send_admin_registration_notification(company_id: int):
    edit_company_url = reverse('admin:company_company_change', args=(company_id,))
    url = urljoin(settings.BASE_URL, edit_company_url)
    context = {
        'url': url,
        'frontend_url': settings.FRONTEND_URL,
    }

    subject, body_plain, body_html = render_email('new_registration', context)

    receiver_emails_list = list(
        UserModel.objects.staff()
        .filter(notification_settings__company_registration=True)
        .values_list('email', flat=True)
    )

    if len(receiver_emails_list) > 0:
        send_html_email(
            subject=subject,
            body_plain=body_plain,
            body_html=body_html,
            to=receiver_emails_list,
        )
    else:
        capture_message('No receivers for company registration notification')


def send_user_registration_complete_notification(company):
    context = {
        'url': urljoin(settings.FRONTEND_URL, '/login'),
        'frontend_url': settings.FRONTEND_URL,
    }

    subject, body_plain, body_html = render_translated_email('registration_complete', context)
    receiver_emails_list = list(company.users_queryset.values_list('email', flat=True))

    if len(receiver_emails_list) > 0:
        send_html_email(
            subject=subject,
            body_plain=body_plain,
            body_html=body_html,
            to=receiver_emails_list,
        )
    else:
        capture_message(f'No receivers for registration complete notification (company ID={company.id})')
