from urllib.parse import urljoin

from django.conf import settings
from django.contrib.auth import get_user_model
from django.urls import reverse

from sentry_sdk import capture_message

from common.email import render_email, send_html_email, send_translated_email
from company.models import Company

UserModel = get_user_model()


def send_admin_registration_notification(company: Company):
    assert company is not None

    edit_company_url = reverse('admin:company_company_change', args=(company.id,))
    absolute_edit_company_url = urljoin(settings.BASE_URL, edit_company_url)

    company = Company.objects.filter(id=company.id).first()
    company_user = company.users_queryset.first()
    receiver_list = list(UserModel.objects.staff().filter(notification_settings__company_registration=True))

    for user in receiver_list:
        context = {
            'user': user,
            'company': company,
            'company_user': company_user,
            'url': absolute_edit_company_url,
            'frontend_url': settings.FRONTEND_URL,
        }
        subject, body_plain, body_html = render_email('new_registration', context)
        send_html_email(
            subject=subject,
            body_plain=body_plain,
            body_html=body_html,
            to=[user.email],
        )
    else:
        capture_message('No receivers for company registration notification')


def send_user_registration_complete_notification(company):
    assert company is not None
    receiver_list = company.users_queryset.all().active()

    for user in receiver_list:
        send_translated_email(
            'registration_complete',
            user,
            url=urljoin(settings.FRONTEND_URL, '/auth/login'),
        )
    else:
        capture_message(f'No receivers for registration complete notification (company ID={company.id})')


def send_company_data_changed_notification(company):
    assert company is not None
    receiver_list = company.users_queryset.active()

    for user in receiver_list:
        send_translated_email(
            'registration_complete',
            user,
            url=urljoin(settings.FRONTEND_URL, '/account-settings/change-company-data'),
        )
    else:
        capture_message(f'No receivers for company data changed notification (company ID={company.id})')
