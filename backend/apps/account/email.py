from urllib.parse import urljoin

from django.conf import settings
from django.contrib.auth import get_user_model

from ai_kit_auth.services import get_activation_url

from common.email import send_translated_email

UserModel = get_user_model()


def send_user_confirm_email_notification(user: UserModel):
    """
    Sends the initial mail for a nonactive user.
    """
    send_translated_email('confirm_email', user, url=get_activation_url(user))


def send_reset_password_mail(user, url):
    """
    Sends email to reset a password
    """
    send_translated_email('reset_password', user, url=url)


def send_request_email_change_confirm_mail(user, email_change_request):
    """
    Sends email to confirm the new email after changing it
    """
    new_email = user.email_change_request.email
    send_translated_email(
        'reset_password',
        user,
        url=email_change_request.get_change_email_link(),
        new_email=new_email,
    )


def send_account_data_changed_mail(user):
    """
    Send notification to user that his account data changed
    """
    send_translated_email(
        'account_data_update',
        user,
        url=urljoin(settings.FRONTEND_URL, '/account-settings/edit-account'),
    )


def send_account_deactivated_mail(user):
    """
    Send notification to user that his account has been deactivated
    """
    send_translated_email(
        'account_deactivated',
        user,
        url=settings.FRONTEND_URL,
    )
