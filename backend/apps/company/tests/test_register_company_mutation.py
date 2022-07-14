from django.core import mail

from model_bakery import baker

from account.models import User
from common.tests.test_base import BaseApiTestCase
from company.models import Company


class RegisterCompanyMutationTestCase(BaseApiTestCase):
    MUTATION = """
        mutation registerCompany(
            $companyName: String!,
            $companyDistributorType: DistributorType!
            $userEmail: String!,
            $userTitle: String!,
            $userFullName: String!,
            $userPosition: String!,
            $userPhoneOrMobile: String!,
            $password: String!
            $countryCode: String!
        ) {
            registerCompany(
                companyName: $companyName,
                companyDistributorType: $companyDistributorType,
                userEmail: $userEmail,
                userTitle: $userTitle,
                userFullName: $userFullName,
                userPosition: $userPosition,
                userPhoneOrMobile: $userPhoneOrMobile,
                password: $password
                countryCode: $countryCode
            )
        }
    """

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.mutation_params = {
            "companyName": "Farwell Co",
            "companyDistributorType": "IMPORTER",
            "userTitle": "mr",
            "userEmail": "helmut@local.invalid",
            "userFullName": "Helmut Karsten",
            "userPosition": "Da Bozz",
            "userPhoneOrMobile": "+49110",
            "password": "Pass123$",
            "countryCode": "en",
        }
        cls.headers = {'HTTP_ACCEPT_LANGUAGE': 'en'}

    def test_register_a_company_should_create_company_and_user(self):
        content = self.query_and_load_data(self.MUTATION, variables=self.mutation_params, headers=self.headers)
        self.assertEqual(content['registerCompany'], 'CREATED')
        company = Company.objects.filter(is_active=False, name="Farwell Co").first()
        user = User.objects.filter(
            email='helmut@local.invalid', is_active=False, related_company__id=company.id
        ).first()
        self.assertIsNotNone(company)
        self.assertEqual('en', company.country_code)
        self.assertIsNotNone(user)
        self.assertEqual(user.id, company.created_by_id)
        # assert activation email to be sent
        self.assertEqual(1, len(mail.outbox))
        self.assertEqual(['helmut@local.invalid'], mail.outbox[0].to)
        self.assertEqual('noreply@ambient.digital', mail.outbox[0].from_email)

    def test_register_a_company_should_save_language_from_header_and_send_correct_email(self):
        headers = {'HTTP_ACCEPT_LANGUAGE': 'ar'}

        content = self.query_and_load_data(self.MUTATION, variables=self.mutation_params, headers=headers)
        self.assertEqual(content['registerCompany'], 'CREATED')
        company = Company.objects.filter(is_active=False, name="Farwell Co").first()
        user = User.objects.filter(
            email='helmut@local.invalid', is_active=False, related_company__id=company.id
        ).first()

        # check language was saved correctly as send in HTTP_ACCEPT_LANGUAGE header
        self.assertEqual('ar', user.language_preference)

        # check mail was send in correct language as send in user.language_preference
        self.assertEqual('مرحبًا بك في أداة تسجيل EPR', mail.outbox[0].subject)

    def test_register_a_company_with_invalid_company_name(self):
        self.mutation_params['companyName'] = '  '
        self.query_and_assert_error(
            self.MUTATION,
            variables=self.mutation_params,
            headers=self.headers,
            message='validationError',
        )

    def test_register_a_company_with_invalid_distributor_type(self):
        self.mutation_params['companyDistributorType'] = 'INVALID'
        self.query_and_assert_error(
            self.MUTATION,
            variables=self.mutation_params,
            message=(
                "Variable '$companyDistributorType' got invalid value 'INVALID'; "
                "Value 'INVALID' does not exist in 'DistributorType' enum."
            ),
        )

    def test_register_a_company_with_invalid_email(self):
        self.mutation_params['userEmail'] = 'hemlut@invalid'
        self.query_and_assert_error(
            self.MUTATION,
            variables=self.mutation_params,
            message='validationError',
        )

    def test_register_a_company_with_bad_password(self):
        self.mutation_params['password'] = 'abc'
        self.query_and_assert_error(
            self.MUTATION,
            variables=self.mutation_params,
            message='passwordTooShort',
        )

    def test_register_a_company_with_duplicated_user_email(self):
        baker.make_recipe('account.tests.user', email='helmut@local.invalid')
        self.query_and_assert_error(
            self.MUTATION,
            variables=self.mutation_params,
            message='userEmailDoesAlreadyExist',
        )

    def test_register_a_company_unsupported_accept_header_language_does_not_fail(self):
        headers = {'HTTP_ACCEPT_LANGUAGE': 'fr'}
        response = self.query(self.MUTATION, variables=self.mutation_params, headers=headers)
        self.assertResponseNoErrors(response)

    def test_register_a_company_not_sending_language_header_does_not_fail(self):
        response = self.query(self.MUTATION, variables=self.mutation_params)
        self.assertResponseNoErrors(response)

    def test_register_a_company_with_invalid_country_code(self):
        self.mutation_params['countryCode'] = 'abc'
        self.query_and_assert_error(
            self.MUTATION,
            variables=self.mutation_params,
            message='validationError',
        )

    def test_register_a_company_stores_country_code_in_lower_case(self):
        self.mutation_params['countryCode'] = 'EN'
        self.query(self.MUTATION, variables=self.mutation_params)
        company = Company.objects.get(name="Farwell Co")
        self.assertEqual('en', company.country_code)
