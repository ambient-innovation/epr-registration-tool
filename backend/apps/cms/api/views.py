from django.contrib.contenttypes.models import ContentType
from django.utils.datastructures import MultiValueDictKeyError

from rest_framework.response import Response
from wagtail.api.v2.views import PagesAPIViewSet
from wagtail_headless_preview.models import PagePreview


class PagePreviewAPIViewSet(PagesAPIViewSet):
    known_query_parameters = PagesAPIViewSet.known_query_parameters.union(["content_type", "token"])

    def listing_view(self, request):
        return self.get_preview_response()

    def detail_view(self, request, pk):
        return self.get_preview_response()

    def get_object(self):
        try:
            app_label, model = self.request.GET["content_type"].split(".")
        except MultiValueDictKeyError:
            raise ValueError('Missing content_type')
        except ValueError:
            raise ValueError('Invalid content_type')
        try:
            token = self.request.GET["token"]
        except MultiValueDictKeyError:
            raise ValueError('Missing token')
        content_type = ContentType.objects.get(app_label=app_label, model=model)
        page_preview = PagePreview.objects.get(content_type=content_type, token=token)
        page = page_preview.as_page()
        if not page.pk:
            # fake primary key to stop API URL routing from complaining
            page.pk = 0
        return page

    def get_preview_response(self):
        try:
            page = self.get_object()
        except ValueError as e:
            return Response(status=400, data={'message': str(e)})
        except ContentType.DoesNotExist:
            return Response(status=404, data={'message': 'Content type does not exist'})
        except PagePreview.DoesNotExist:
            return Response(status=404, data={'message': 'Page preview does not exist'})

        serializer = self.get_serializer(page)
        return Response(serializer.data)
