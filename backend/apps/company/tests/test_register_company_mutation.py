from model_bakery import baker

from account.models import User
from apps.common.tests.test_base import BaseApiTestCase
from company.models import CompaniesSubsectors, Company


class RegisterCompanyMutationTestCase(BaseApiTestCase):
    QUERY = """
        mutation registerCompany(
            $name: String!,
            $streetAndNumber: String!,
            $zipCode: Int!,
            $city: String!,
            $country: String!,
            $province: String!,
            $additionalAddressInfo: String!,
            $phone: String!,
            $mobile: String!,
            $fax: String!,
            $registrationNumber: Int!,
            $companyEmail: String!,
            $userEmail: String!,
            $title: String!,
            $fullName: String!,
            $position: String!,
            $phoneOrMobile: String!, $subsectorIds: [Int!]!, $password: String!
        ) {
            registerCompany(
                name: $name,
                streetAndNumber: $streetAndNumber,
                zipCode: $zipCode,
                city: $city,
                country: $country,
                province: $province,
                additionalAddressInfo: $additionalAddressInfo,
                phone: $phone,
                mobile: $mobile,
                fax: $fax,
                registrationNumber: $registrationNumber,
                companyEmail: $companyEmail,
                subsectorIds: $subsectorIds,
                userEmail: $userEmail,
                title: $title,
                fullName: $fullName,
                position: $position,
                phoneOrMobile: $phoneOrMobile,
                password: $password
            )
        }
    """

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.sector = baker.make_recipe('company.tests.sector')
        cls.subsector1 = baker.make_recipe(
            'company.tests.subsector',
            name_en='Processed Sugar',
            name_ar='Processed Sugar_ar',
            related_sector=cls.sector,
        )
        cls.subsector2 = baker.make_recipe(
            'company.tests.subsector',
            name_en='Oatmeals',
            name_ar='Oatmeals_ar',
            name='Organic',
            related_sector=cls.sector,
        )
        cls.mutation_params = {
            "name": "Farwell Co",
            "companyEmail": "farwell@local.invalid",
            "registrationNumber": 12345678,
            "streetAndNumber": "Al-Horriyah 12",
            "zipCode": 11623,
            "city": "Mqabalain",
            "province": "Amman",
            "country": "Jordan",
            "additionalAddressInfo": "Second house from the left",
            "phone": "+962-6-4773466",
            "mobile": "+962-6-4773467",
            "fax": "+962-6-4773468",
            "subsectorIds": [cls.subsector1.pk, cls.subsector2.pk],
            "title": "Mr.",
            "userEmail": "helmut@local.invalid",
            "fullName": "Helmut Karsten",
            "position": "Da Bozz",
            "phoneOrMobile": "+49110",
            "password": "password1234",
        }

    def test_register_a_company_should_create_company_and_user(self):
        content = self.query_and_load_data(self.QUERY, variable_values=self.mutation_params)
        self.assertEqual(content['registerCompany'], 'Company successfully created!')
        self.assertEqual(Company.objects.count(), 1)
        self.assertTrue(User.objects.filter(email='helmut@local.invalid').exists())
        self.assertEqual(CompaniesSubsectors.objects.count(), 2)

    def test_register_a_company_with_invalid_email(self):
        self.mutation_params['userEmail'] = 'hemlut@invalid'
        self.query_and_assert_error(self.QUERY, variable_values=self.mutation_params, message='validation_error')

    # To be implemented yet
    # def test_register_a_company_with_bad_password(self):
    #     self.mutation_params['password'] = 'abc'
    #     self.query_and_assert_error(self.QUERY, variable_values=self.mutation_params, message='validation_error')
