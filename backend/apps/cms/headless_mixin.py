from urllib.parse import urljoin

from django.conf import settings
from django.utils.http import urlencode

from wagtail_headless_preview.models import HeadlessMixin


class CustomHeadlessMixin(HeadlessMixin):
    def get_preview_url(self, token):
        """
        Similar to the original implementation, but:
        - uses custom preview url
        - pass next.js preview secret as query param
        """
        return (
            urljoin(settings.FRONTEND_URL, '/api/preview')
            + "?"
            + urlencode(
                {
                    "content_type": self.get_content_type_str(),
                    "token": token,
                    "secret": settings.NEXTJS_PREVIEW_SECRET,
                }
            )
        )
