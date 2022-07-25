from urllib.parse import urljoin

from django.conf import settings
from django.contrib.auth import get_user_model

from ai_kit_auth.services import get_activation_url

from common.email import render_translated_email, send_html_email

UserModel = get_user_model()


def send_user_activation_notification(user: UserModel):
    """
    Sends the initial mail for a nonactive user.
    """
    assert user is not None
    context = {
        'user': user,
        'url': get_activation_url(user),
        'frontend_url': settings.FRONTEND_URL,
    }
    subject, body_plain, body_html = render_translated_email('user_activation', user.language_preference, context)
    send_html_email(
        subject=subject,
        body_plain=body_plain,
        body_html=body_html,
        to=[user.email],
    )


def send_reset_password_mail(user, url):
    """
    Sends email to reset a password
    """
    context = {
        'user': user,
        'url': url,
        'frontend_url': settings.FRONTEND_URL,
    }

    subject, body_plain, body_html = render_translated_email('reset_password', user.language_preference, context)

    send_html_email(
        subject=subject,
        body_plain=body_plain,
        body_html=body_html,
        to=[user.email],
    )


def send_request_email_change_confirm_mail(user, email_change_request):
    """
    Sends email to confirm the new email
    """
    new_email = user.email_change_request.email
    context = {
        'user': user,
        'new_email': new_email,
        'url': email_change_request.get_change_email_link(),
        'frontend_url': settings.FRONTEND_URL,
    }

    subject, body_plain, body_html = render_translated_email('change_email', user.language_preference, context)

    send_html_email(
        subject=subject,
        body_plain=body_plain,
        body_html=body_html,
        to=[new_email],
    )


def send_account_data_changed_mail(user):
    context = {
        'user': user,
        'url': urljoin(settings.FRONTEND_URL, '/account-settings/edit-account'),
        'frontend_url': settings.FRONTEND_URL,
    }

    subject, body_plain, body_html = render_translated_email('account_data_update', user.language_preference, context)
    send_html_email(
        subject=subject,
        body_plain=body_plain,
        body_html=body_html,
        to=[user.email],
    )
