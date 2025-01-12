from model_bakery import baker

from apps.common.tests.test_base import BaseApiTestCase


class CreateCompanyProfileMutationTestCase(BaseApiTestCase):
    AUTO_CREATE_USERS = True
    ALWAYS_LOGIN_USER = True

    QUERY = """
        query {
            companyDetails {
                id
                isProfileCompleted
                contactInfo {
                    country
                }
            }
        }
    """

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.company = baker.make_recipe('apps.company.tests.company', users_queryset=[cls.user])

    def test_company_details_not_authenticated(self):
        self.logout_user()

        self.query_and_assert_error(
            self.QUERY,
            message='not_authenticated',
        )

    def test_company_details_incomplete(self):
        data = self.query_and_load_data(self.QUERY)
        self.assertEqual(False, data['companyDetails']['isProfileCompleted'])
        self.assertIsNone(data['companyDetails']['contactInfo'])

    def test_company_details_completed(self):
        self.company.identification_number = '123456789'
        self.company.save()
        baker.make('company.CompanyContactInfo', related_company=self.company)
        data = self.query_and_load_data(self.QUERY)
        self.assertEqual(True, data['companyDetails']['isProfileCompleted'])
        self.assertIsNotNone(data['companyDetails']['contactInfo'])

    def test_company_details_without_company(self):
        user_without_company = baker.make_recipe('apps.account.tests.user')
        self.login(user_without_company)
        data = self.query_and_load_data(self.QUERY)
        self.assertIsNone(data['companyDetails'])
