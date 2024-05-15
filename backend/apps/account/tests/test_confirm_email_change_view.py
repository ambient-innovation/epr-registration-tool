from django.conf import settings
from django.contrib import auth

from model_bakery import baker

from apps.account.models import EmailChangeRequest
from apps.common.tests.test_base import BaseTestCase


class ConfirmEmailChangeTestCase(BaseTestCase):
    AUTO_CREATE_USERS = True
    ALWAYS_LOGIN_USER = True

    def setUp(self):
        super().setUp()
        # is not in setUpTestData because first test delete it, and we need fo other tests
        self.email_change_request = baker.make(
            'account.EmailChangeRequest', email='test@test.test', related_user=self.user
        )

    def test_confirm_email_change_view(self):
        self.assertTrue(auth.get_user(self._client).is_authenticated)
        path = self.email_change_request.get_change_email_link()
        response = self._client.get(path)

        self.assertEqual(f'{settings.FRONTEND_URL}/account-settings/change-email-confirm?state=success', response.url)
        self.assertEqual(302, response.status_code)
        self.assertFalse(auth.get_user(self._client).is_authenticated)
        self.user.refresh_from_db()
        self.assertEqual(self.user.email, 'test@test.test')
        self.assertEqual(0, EmailChangeRequest.objects.count())

    def test_confirm_email_change_view_without_request(self):
        self.assertTrue(auth.get_user(self._client).is_authenticated)
        path = self.email_change_request.get_change_email_link()
        self.email_change_request.delete()
        response = self._client.get(path)

        self.assertEqual(
            f'{settings.FRONTEND_URL}/account-settings/change-email-confirm?state=requestDoesNotExists', response.url
        )
        self.assertEqual(302, response.status_code)
        self.assertTrue(auth.get_user(self._client).is_authenticated)

    def test_confirm_email_change_view_with_wrong_token(self):
        self.assertTrue(auth.get_user(self._client).is_authenticated)
        path = self.email_change_request.get_change_email_link() + '1'
        response = self._client.get(path)

        self.assertEqual(
            f'{settings.FRONTEND_URL}/account-settings/change-email-confirm?state=invalidToken', response.url
        )
        self.assertEqual(302, response.status_code)
        self.assertTrue(auth.get_user(self._client).is_authenticated)
