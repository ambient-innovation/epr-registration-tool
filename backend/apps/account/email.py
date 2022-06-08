from django.conf import settings
from django.contrib.auth import get_user_model

from ai_kit_auth.services import get_activation_url, send_email

from common.email import render_translated_email

UserModel = get_user_model()


def send_user_activation_notification(user):
    """
    Sends the initial mail for a nonactive user.
    """
    context = {
        'url': get_activation_url(user),
        'frontend_url': settings.FRONTEND_URL,
    }
    subject, body_plain, body_html = render_translated_email('user_activation', context)
    send_email(subject, body_plain, body_html, user.email)
