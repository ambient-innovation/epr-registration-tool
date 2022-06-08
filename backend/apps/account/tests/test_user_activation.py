from django.core import mail

from model_bakery import baker

from account.email import send_user_activation_notification
from common.tests.test_base import BaseTestCase


class UserActivationTestCase(BaseTestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()

    def test_send_user_activation_notification(self):
        user = baker.make_recipe('account.tests.user', is_active=True)
        send_user_activation_notification(user)

        self.assertEqual(1, len(mail.outbox))
        self.assertEqual(['user1@local.local'], mail.outbox[0].to)
        self.assertEqual('noreply@ambient.digital', mail.outbox[0].from_email)
