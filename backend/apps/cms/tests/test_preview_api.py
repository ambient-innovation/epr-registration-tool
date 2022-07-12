import json

from django.contrib.contenttypes.models import ContentType

from model_bakery import baker
from rest_framework.test import APITestCase


class PagePreviewApiTestCase(APITestCase):

    BASE_URL = '/cms/api/v2/page_preview/1/'

    def test_preview_api_with_missing_content_type(self):
        url = self.BASE_URL
        response = self.client.get(url)
        self.assertEqual(400, response.status_code)
        self.assertEqual('Missing content_type', json.loads(response.content)['message'])

    def test_preview_api_with_invalid_content_type(self):
        url = self.BASE_URL + '?content_type=foo'
        response = self.client.get(url)
        self.assertEqual(400, response.status_code)
        self.assertEqual('Invalid content_type', json.loads(response.content)['message'])

    def test_preview_api_with_missing_token(self):
        url = self.BASE_URL + '?content_type=foo.bar'
        response = self.client.get(url)
        self.assertEqual(400, response.status_code)
        self.assertEqual('Missing token', json.loads(response.content)['message'])

    def test_preview_api_with_non_existing_content_type(self):
        url = self.BASE_URL + '?content_type=foo.bar&token=foo'
        response = self.client.get(url)
        self.assertEqual(404, response.status_code)
        self.assertEqual('Content type does not exist', json.loads(response.content)['message'])

    def test_preview_api_with_non_existing_preview(self):
        url = self.BASE_URL + '?content_type=cms.homepage&token=foo'
        response = self.client.get(url)
        self.assertEqual(404, response.status_code)
        self.assertEqual('Page preview does not exist', json.loads(response.content)['message'])

    def test_preview_api_returns_preview_data(self):
        content_type = ContentType.objects.get(app_label='cms', model='standardpage')
        preview = baker.make(
            'wagtail_headless_preview.PagePreview',
            content_type=content_type,
            content_json=json.dumps(
                {
                    "pk": None,
                    "content_type": content_type.pk,
                    "path": "00010001",
                    "locale": 1,
                }
            ),
        )
        url = self.BASE_URL + f'?content_type=cms.standardpage&token={preview.token}'
        response = self.client.get(url)
        self.assertEqual(200, response.status_code, msg=json.loads(response.content))
        self.assertEqual(
            {
                'body': [],
                'id': None,
                'meta': {
                    'alias_of': None,
                    'detail_url': 'http://localhost/cms/api/v2/pages/0/',
                    'first_published_at': None,
                    'html_url': None,
                    'locale': 'en',
                    'parent': None,
                    'search_description': '',
                    'seo_title': '',
                    'show_in_menus': False,
                    'slug': '',
                    'type': 'cms.StandardPage',
                },
                'title': '',
            },
            json.loads(response.content),
        )
