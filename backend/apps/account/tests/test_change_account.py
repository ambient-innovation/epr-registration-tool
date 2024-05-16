from model_bakery import baker

from apps.common.tests.test_base import BaseApiTestCase


class AccountChangeMutationTestCase(BaseApiTestCase):
    AUTO_CREATE_USERS = True
    ALWAYS_LOGIN_USER = True

    MUTATION = """
        mutation changeAccount(
            $accountData: UserChangeInputType!
        ) {
            changeAccount(
                accountData: $accountData
            )
        }
    """

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.user_account_data = {
            'email': cls.user.email,
            'title': cls.user.title,
            'fullName': cls.user.full_name,
            'position': cls.user.position,
            'phoneOrMobile': cls.user.phone_or_mobile,
        }

    def test_change_only_title(self):
        content = self.query_and_load_data(
            self.MUTATION,
            variables={'accountData': {**self.user_account_data, 'title': 'mrs'}},
        )

        self.assertEqual('UPDATED', content['changeAccount'])
        self.user.refresh_from_db()

        self.assertFalse(hasattr(self.user, 'email_change_request'))
        self.assertEqual('mrs', self.user.title)

    def test_change_email_and_title_creates_new_change_request(self):
        content = self.query_and_load_data(
            self.MUTATION,
            variables={'accountData': {**self.user_account_data, 'title': 'mr', 'email': 'IamKing@epr.local'}},
        )
        self.assertEqual('UPDATED', content['changeAccount'])
        self.user.refresh_from_db()

        self.assertTrue(hasattr(self.user, 'email_change_request'))
        self.assertEqual('IamKing@epr.local', self.user.email_change_request.email)

    def test_change_making_second_change_request_deletes_old(self):
        baker.make_recipe(
            'apps.account.tests.email_change_request',
            email='iAmTheNewOldEmail@epr.local',
            related_user=self.user,
        )

        self.assertTrue(hasattr(self.user, 'email_change_request'))

        content = self.query_and_load_data(
            self.MUTATION,
            variables={'accountData': {**self.user_account_data, 'email': 'IamKing@epr.local'}},
        )
        self.assertEqual('UPDATED', content['changeAccount'])
        self.user.refresh_from_db()

        self.assertTrue(hasattr(self.user, 'email_change_request'))
        self.assertEqual('IamKing@epr.local', self.user.email_change_request.email)

    def test_change_not_confirmed_email_address_back_to_original_one(self):
        baker.make('account.EmailChangeRequest', email='test@test.test', related_user=self.user)
        self.user.refresh_from_db()
        self.assertTrue(hasattr(self.user, 'email_change_request'))
        self.assertEqual('test@test.test', self.user.email_change_request.email)

        content = self.query_and_load_data(
            self.MUTATION,
            variables={'accountData': {**self.user_account_data}},
        )
        self.assertEqual('UPDATED', content['changeAccount'])
        self.user.refresh_from_db()

        self.assertFalse(hasattr(self.user, 'email_change_request'))
