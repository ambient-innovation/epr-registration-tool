from urllib.parse import urljoin

from django.conf import settings
from django.shortcuts import redirect
from django.utils.http import urlencode

from wagtail_headless_preview.models import HeadlessMixin


class CustomHeadlessMixin(HeadlessMixin):
    SERVE_PATH = 'go-to'

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

    def serve(self, request):
        """
        Slightly adjusted version of the HeadlessMixin.serve(),
        that removes the base bath of the serve URL.
        This is necessary, because our serve-url does not start at root level.
        """
        base_url = settings.FRONTEND_URL
        site_id, site_root, relative_page_url = self.get_url_parts(request)

        return redirect(f"{base_url.rstrip('/')}{relative_page_url.removeprefix('/' + self.SERVE_PATH)}")
