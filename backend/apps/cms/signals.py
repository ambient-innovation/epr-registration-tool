from urllib.parse import urljoin

from django.conf import settings

import requests
from sentry_sdk import capture_exception
from wagtail.signals import page_published

from cms.models import HomePage

GITLAB_URL = "https://gitlab.ambient-innovation.com"
PROJECT_ID = 576


def trigger_pipeline(ref: str, token):
    url = f"{GITLAB_URL}/api/v4/projects/{PROJECT_ID}/ref/{ref}/trigger/pipeline?token={token}"
    requests.post(url)


def trigger_frontend_rebuild(sender, **kwargs):
    """
    Trigger frontend revalidating api on page publish
    """
    try:
        api = urljoin(settings.FRONTEND_URL, "/api/webhook")
        show_in_menus = kwargs["instance"].show_in_menus
        # in webhook in next js we expect always the home page to be have 'home' slug.
        slug = 'home' if isinstance(kwargs["instance"], HomePage) else kwargs["instance"].slug
        requests.post(
            api,
            data={"secret": settings.NEXTJS_PUBLISH_SECRET, "slug": slug, "showInMenus": show_in_menus},
            verify=False,
        )
    except Exception as e:
        capture_exception(e)
        # Or Trigger frontend rebuild using gitlab pipeline on page publish if the revalidating post failed
        if settings.REBUILD_FRONTEND_TRIGGER_TOKEN and settings.REBUILD_FRONTEND_TRIGGER_REF:
            trigger_pipeline(
                ref=settings.REBUILD_FRONTEND_TRIGGER_REF,
                token=settings.REBUILD_FRONTEND_TRIGGER_TOKEN,
            )


page_published.connect(trigger_frontend_rebuild)
