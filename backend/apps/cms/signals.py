from django.conf import settings

import requests
from wagtail.signals import page_published

GITLAB_URL = "https://gitlab.ambient-innovation.com"
PROJECT_ID = 576


def trigger_pipeline(ref: str, token):
    url = f"{GITLAB_URL}/api/v4/projects/{PROJECT_ID}/ref/{ref}/trigger/pipeline?token={token}"
    requests.post(url)


@page_published.connect
def trigger_frontend_rebuild(sender, **kwargs):
    """
    Trigger frontend rebuild on page publish
    """
    if settings.REBUILD_FRONTEND_TRIGGER_TOKEN and settings.REBUILD_FRONTEND_TRIGGER_REF:
        trigger_pipeline(
            ref=settings.REBUILD_FRONTEND_TRIGGER_REF,
            token=settings.REBUILD_FRONTEND_TRIGGER_TOKEN,
        )
