from django.contrib.contenttypes.models import ContentType

from rest_framework.response import Response
from wagtail.api.v2.views import PagesAPIViewSet
from wagtail_headless_preview.models import PagePreview


class PagePreviewAPIViewSet(PagesAPIViewSet):
    known_query_parameters = PagesAPIViewSet.known_query_parameters.union(["content_type", "token"])

    def listing_view(self, request):
        return self.get_preview_response()

    def detail_view(self, request, pk):
        return self.get_preview_response()

    def get_preview_response(self):
        page = self.get_object()
        if page:
            serializer = self.get_serializer(page)
            return Response(serializer.data)
        else:
            return Response(status=404)

    def get_object(self):
        app_label, model = self.request.GET["content_type"].split(".")
        try:
            content_type = ContentType.objects.get(app_label=app_label, model=model)
        except ContentType.DoesNotExist:
            return None

        try:
            page_preview = PagePreview.objects.get(content_type=content_type, token=self.request.GET["token"])
        except PagePreview.DoesNotExist:
            return None

        page = page_preview.as_page()
        if not page.pk:
            # fake primary key to stop API URL routing from complaining
            page.pk = 0

        return page
