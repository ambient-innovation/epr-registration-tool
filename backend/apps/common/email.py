from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import translation


def render_email(email_name: str, context=None):
    subject = render_to_string(f'email/{email_name}/subject.txt', context).replace("\n", " ")
    body_plain = render_to_string(f'email/{email_name}/body.txt', context)
    body_html = render_to_string(f'email/{email_name}/body.html', context)

    return subject, body_plain, body_html


def render_translated_email(email_name: str, context=None):
    current_lng = translation.get_language().split('-')[0]

    subject = render_to_string(f'email/{email_name}/{current_lng}/subject.txt', context).replace("\n", " ")
    body_plain = render_to_string(f'email/{email_name}/{current_lng}/body.txt', context)
    body_html = render_to_string(f'email/{email_name}/{current_lng}/body.html', context)

    return subject, body_plain, body_html


def send_html_email(subject, body_plain, body_html, to: [str], **kwargs):
    from_email = settings.DEFAULT_FROM_EMAIL
    msg = EmailMultiAlternatives(
        subject=subject,
        body=body_plain,
        from_email=from_email,
        to=to,
        **kwargs,
    )
    msg.attach_alternative(body_html, "text/html")
    msg.send()
