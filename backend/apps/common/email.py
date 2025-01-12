from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string


def render_email(email_name: str, context=None):
    subject = render_to_string(f'email/{email_name}/subject.txt', context).replace("\n", " ")
    body_plain = render_to_string(f'email/{email_name}/body.txt', context)
    body_html = render_to_string(f'email/{email_name}/body.html', context)

    return subject, body_plain, body_html


def render_translated_email(email_name: str, language_preference: str, context=None):
    subject = render_to_string(f'email/{email_name}/{language_preference}/subject.txt', context).replace("\n", " ")
    body_plain = render_to_string(f'email/{email_name}/{language_preference}/body.txt', context)
    body_html = render_to_string(f'email/{email_name}/{language_preference}/body.html', context)

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


def send_translated_email(email_name, user, **extra_context):
    assert user is not None
    context = {
        'user': user,
        'frontend_url': settings.FRONTEND_URL,
        **extra_context,
    }
    subject, body_plain, body_html = render_translated_email(email_name, user.language_preference, context)
    send_html_email(
        subject=subject,
        body_plain=body_plain,
        body_html=body_html,
        to=[user.email],
    )
