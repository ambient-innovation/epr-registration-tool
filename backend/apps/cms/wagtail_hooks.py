from django.conf import settings
from django.contrib import messages

from wagtail import hooks


@hooks.register('after_publish_page')
def send_publish_message(request, page):
    if settings.REBUILD_FRONTEND_TRIGGER_TOKEN and settings.REBUILD_FRONTEND_TRIGGER_REF:
        messages.warning(
            request,
            'You just published a page. '
            'It can take up to 20 minutes before the changes take effect. '
            'For an immediate preview, please use the "preview" button, next to "save".',
        )
