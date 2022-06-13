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
        }

    def test_register_a_company_should_create_company_and_user(self):
        content = self.query_and_load_data(self.MUTATION, variables=self.mutation_params)
        self.assertEqual(content['registerCompany'], 'CREATED')
        company = Company.objects.filter(is_active=False, name="Farwell Co").first()
        user = User.objects.filter(
            email='helmut@local.invalid', is_active=False, related_company__id=company.id
        ).first()
        self.assertIsNotNone(company)
        self.assertIsNotNone(user)
        self.assertEqual(user.id, company.created_by_id)
        # assert activation email to be sent
        self.assertEqual(1, len(mail.outbox))
        self.assertEqual(['helmut@local.invalid'], mail.outbox[0].to)
        self.assertEqual('noreply@ambient.digital', mail.outbox[0].from_email)

    def test_register_a_company_with_invalid_company_name(self):
        self.mutation_params['companyName'] = '  '
        self.query_and_assert_error(
            self.MUTATION,
            variables=self.mutation_params,
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
