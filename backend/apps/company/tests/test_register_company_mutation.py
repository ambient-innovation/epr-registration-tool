from model_bakery import baker

from account.models import User
from apps.common.tests.test_base import BaseApiTestCase
from company.models import CompaniesSubsectors, Company


class RegisterCompanyMutationTestCase(BaseApiTestCase):
    MUTATION = """
        mutation registerCompany(
            $companyName: String!,
            $subsectorIds: [Int!]!,
            $userEmail: String!,
            $userTitle: String!,
            $userFullName: String!,
            $userPosition: String!,
            $userPhoneOrMobile: String!,
            $password: String!
        ) {
            registerCompany(
                companyName: $companyName,
                subsectorIds: $subsectorIds,
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
        cls.sector1, cls.sector2 = baker.make_recipe(
            'company.tests.sector',
            _quantity=2,
        )
        cls.subsector1, cls.subsector2 = baker.make_recipe(
            'company.tests.subsector',
            related_sector=cls.sector1,
            _quantity=2,
        )
        cls.subsector3, cls.subsector4 = baker.make_recipe(
            'company.tests.subsector',
            related_sector=cls.sector2,
            _quantity=2,
        )
        cls.mutation_params = {
            "companyName": "Farwell Co",
            "subsectorIds": [cls.subsector1.pk, cls.subsector2.pk],
            "userTitle": "Mr.",
            "userEmail": "helmut@local.invalid",
            "userFullName": "Helmut Karsten",
            "userPosition": "Da Bozz",
            "userPhoneOrMobile": "+49110",
            "password": "Pass123$",
        }

    def test_register_a_company_should_create_company_and_user(self):
        content = self.query_and_load_data(self.MUTATION, variable_values=self.mutation_params)
        self.assertEqual(content['registerCompany'], 'Company successfully created!')
        self.assertEqual(Company.objects.count(), 1)
        self.assertTrue(User.objects.filter(email='helmut@local.invalid').exists())
        self.assertEqual(CompaniesSubsectors.objects.count(), 2)

    def test_register_a_company_with_invalid_company_name(self):
        self.mutation_params['companyName'] = '  '
        self.query_and_assert_error(self.MUTATION, variable_values=self.mutation_params, message='validationError')

    def test_register_a_company_with_invalid_email(self):
        self.mutation_params['userEmail'] = 'hemlut@invalid'
        self.query_and_assert_error(self.MUTATION, variable_values=self.mutation_params, message='validationError')

    def test_register_a_company_with_bad_password(self):
        self.mutation_params['password'] = 'abc'
        self.query_and_assert_error(self.MUTATION, variable_values=self.mutation_params, message='passwordTooShort')

    def test_register_a_company_with_invalid_subsections(self):
        self.mutation_params['subsectorIds'] = [
            # subsectors of different sectors
            self.subsector1.pk,
            self.subsector3.pk,
        ]
        self.query_and_assert_error(
            self.MUTATION,
            variable_values=self.mutation_params,
            message='invalidSubsectorSelection',
        )

    def test_register_a_company_with_without_subsectors(self):
        self.mutation_params['subsectorIds'] = []
        self.query_and_assert_error(
            self.MUTATION,
            variable_values=self.mutation_params,
            message='invalidSubsectorSelection',
        )

    def test_register_a_company_with_duplicated_user_email(self):
        baker.make_recipe('account.tests.user', email='helmut@local.invalid')
        self.query_and_assert_error(
            self.MUTATION,
            variable_values=self.mutation_params,
            message='userEmailDoesAlreadyExist',
        )
