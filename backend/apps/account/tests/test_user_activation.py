from django.contrib import auth
from django.core import mail

from ai_kit_auth.services import get_activation_url
from model_bakery import baker
from rest_framework import reverse

from apps.account.email import send_user_confirm_email_notification
from apps.common.tests.test_base import BaseTestCase


class UserActivationTestCase(BaseTestCase):
    ACTIVATION_URL = reverse.reverse_lazy('auth_api:activate')

    def test_send_user_activation_notification(self):
        user = baker.make_recipe('account.tests.user')
        send_user_confirm_email_notification(user)

        self.assertEqual(1, len(mail.outbox))
        self.assertEqual(['user1@local.local'], mail.outbox[0].to)
        self.assertEqual('noreply@ambient.digital', mail.outbox[0].from_email)

    def test_activate_email_api(self):
        company = baker.make_recipe('company.tests.company', is_active=False)
        user = baker.make_recipe('account.tests.user', has_email_confirmed=False, related_company=company)
        # receiver of admin notification
        admin = baker.make_recipe('account.tests.super_user')
        baker.make('account.NotificationSettings', related_user=admin)

        self.assertEqual(False, user.has_email_confirmed)
        self.assertEqual(False, auth.get_user(self._client).is_authenticated)
        frontend_activation_url = get_activation_url(user)
        path, params = frontend_activation_url.split('?')
        ident, token = params.split('&')

        self.assertEqual('http://localhost:3000/auth/activation', path)
        response = self._client.post(
            self.ACTIVATION_URL,
            data={
                'ident': ident.split('=')[1],
                'token': token.split('=')[1],
            },
        )

        self.assertEqual(200, response.status_code)
        self.assertEqual(False, auth.get_user(self._client).is_authenticated)
        user.refresh_from_db()
        self.assertEqual(True, user.has_email_confirmed)

        self.assertEqual(1, len(mail.outbox))
        self.assertEqual([admin.email], mail.outbox[0].to)
        self.assertEqual('noreply@ambient.digital', mail.outbox[0].from_email)
