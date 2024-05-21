from django.core import mail

from model_bakery import baker

from apps.common.tests.test_base import BaseTestCase
from apps.company.email import send_admin_registration_notification, send_user_registration_complete_notification


class CompanyActivationNotificationsTestCase(BaseTestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()

    def test_send_admin_registration_notification(self):
        user_1, user_2 = baker.make_recipe('apps.account.tests.super_user', _quantity=2)
        baker.make(
            'account.NotificationSettings',
            related_user=user_1,
            company_registration=True,
        )

        company = baker.make_recipe('apps.company.tests.company', users_queryset=[user_1, user_2])
        send_admin_registration_notification(company)

        self.assertEqual(1, len(mail.outbox))
        self.assertEqual(['superuser1@local.local'], mail.outbox[0].to)
        self.assertEqual('noreply@ambient.digital', mail.outbox[0].from_email)

    def test_send_user_registration_complete_notification(self):
        company = baker.make_recipe('apps.company.tests.company')
        baker.make_recipe('apps.account.tests.user', related_company=company)
        baker.make_recipe('apps.account.tests.user', related_company=company)
        baker.make_recipe('apps.account.tests.user')

        send_user_registration_complete_notification(company)

        self.assertEqual(2, len(mail.outbox))
        receivers_emails = [*mail.outbox[0].to, *mail.outbox[1].to]
        self.assertIn('user1@local.local', receivers_emails)
        self.assertIn('user2@local.local', receivers_emails)
