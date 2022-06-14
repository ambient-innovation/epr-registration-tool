from model_bakery import baker

from common.tests.test_base import BaseApiTestCase
from company.models import Company


class CreateCompanyProfileMutationTestCase(BaseApiTestCase):
    AUTO_CREATE_USERS = True
    ALWAYS_LOGIN_USER = True

    MUTATION = """
        mutation createCompanyProfile(
            $profileData: CompanyProfileInputType!
            $identificationNumber: String!
        ) {
            createCompanyProfile(
                profileData: $profileData
                identificationNumber: $identificationNumber
            )
        }
    """

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.company = baker.make_recipe('company.tests.company', users_queryset=[cls.user])

        cls.mutation_params = {
            'profileData': {
                'country': 'Germany',
                'postalCode': '53556',
                'city': 'Cologne',
                'street': 'Some Street',
                'streetNumber': '21',
                'phoneNumber': '3423423434',
                'additionalAddressInfo': 'Some Text',
            },
            'identificationNumber': '1234455677',
        }

    def test_create_company_profile_not_logged_in_fails(self):
        self.logout_user()

        self.query_and_assert_error(
            self.MUTATION,
            variables=self.mutation_params,
            message='not_authenticated',
        )

    def test_create_company_profile_user_has_no_company(self):
        self.user.related_company = None
        self.user.save()

        self.query_and_assert_error(
            self.MUTATION,
            variables=self.mutation_params,
            message='noCompanyAssignedORInactiveCompany',
        )

    def test_create_company_profile(self):
        content = self.query_and_load_data(self.MUTATION, variables=self.mutation_params)
        self.assertEqual(content['createCompanyProfile'], 'CREATED')
        company = Company.objects.first()
        self.assertEqual(company.identification_number, '1234455677')
        self.assertIsNotNone(company.related_contact_info)

    def test_create_company_profile_identification_number_has_spaces_fails(self):
        self.mutation_params['identificationNumber'] = '1232 4343 43434'
        self.query_and_assert_error(
            self.MUTATION,
            variables=self.mutation_params,
            message='whitespacesNotAllowed',
        )

    def test_create_company_profile_without_additional_info_no_errors(self):
        mutation_params_missing_optional = {
            'profileData': {
                'country': 'Germany',
                'postalCode': '53556',
                'city': 'Cologne',
                'street': 'Some Street',
                'streetNumber': '21',
                'phoneNumber': '3423423434',
            },
            'identificationNumber': '1234455677',
        }
        self.query_and_load_data(self.MUTATION, variables=mutation_params_missing_optional)

    def test_create_company_profile_city_with_whitespaces_clears_value(self):
        mutation_params_missing_optional = {
            'profileData': {
                'country': 'Germany',
                'postalCode': '53556',
                'city': '   Cologne  ',
                'street': 'Some Street',
                'streetNumber': '21',
                'phoneNumber': '3423423434',
                'additionalAddressInfo': 'Some Text',
            },
            'identificationNumber': '1234455677',
        }
        self.query_and_load_data(self.MUTATION, variables=mutation_params_missing_optional)
        self.company.refresh_from_db()
        self.assertEqual('Cologne', self.company.related_contact_info.city)
