from model_bakery import baker

from common.tests.test_base import BaseApiTestCase


class CreateCompanyProfileMutationTestCase(BaseApiTestCase):
    AUTO_CREATE_USERS = True
    ALWAYS_LOGIN_USER = True

    QUERY = """
        query {
            companyDetails {
                id
                isProfileCompleted
            }
        }
    """

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.company = baker.make_recipe('company.tests.company', users_queryset=[cls.user])

    def test_company_details_not_authenticated(self):
        self.logout_user()

        self.query_and_assert_error(
            self.QUERY,
            message='not_authenticated',
        )

    def test_company_details_incomplete(self):
        data = self.query_and_load_data(self.QUERY)
        self.assertEqual(False, data['companyDetails']['isProfileCompleted'])

    def test_company_details_completed(self):
        self.company.identification_number = '123456789'
        self.company.save()
        baker.make('company.CompanyContactInfo', related_company=self.company)
        data = self.query_and_load_data(self.QUERY)
        self.assertEqual(True, data['companyDetails']['isProfileCompleted'])
