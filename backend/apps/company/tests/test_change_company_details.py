from model_bakery import baker

from common.tests.test_base import BaseApiTestCase
from company.models import Company


class ChangeCompanyDetailsTestCase(BaseApiTestCase):
    AUTO_CREATE_USERS = True
    ALWAYS_LOGIN_USER = True

    MUTATION = """
        mutation changeCompanyDetails(
            $companyInput: CompanyInput!
            $contactInfoInput: CompanyContactInfoInput!
        ) {
            changeCompanyDetails(
                companyInput: $companyInput
                contactInfoInput: $contactInfoInput
            )
        }
    """

    DEFAULT_COMPANY_INPUT = {
        'name': 'Farwell Co (updated)',
        'distributorType': 'LOCAL_PRODUCER',
        'identificationNumber': "DE1235458_updated",
    }
    DEFAULT_CONTACT_INFO_INPUT = {
        'country': 'Jordan (updated)',
        'postalCode': '12345 (updated)',
        'city': 'Amman (updated)',
        'street': 'Street (updated)',
        'streetNumber': '10 (updated)',
        'additionalAddressInfo': "Second floor (updated)",
        'phoneNumber': '+9 123654 (updated)',
    }

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.company = baker.make_recipe('company.tests.company', users_queryset=[cls.user])

    def assert_default_values(self, company, contact_info):
        self.assertEqual('Farwell Co (updated)', company.name)
        self.assertEqual('DE1235458_updated', company.identification_number)
        self.assertEqual('LOCAL_PRODUCER', company.distributor_type)
        # --- contact info ---
        self.assertEqual('Jordan (updated)', contact_info.country)
        self.assertEqual('12345 (updated)', contact_info.postal_code)
        self.assertEqual('Amman (updated)', contact_info.city)
        self.assertEqual('Street (updated)', contact_info.street)
        self.assertEqual('10 (updated)', contact_info.street_number)
        self.assertEqual('Second floor (updated)', contact_info.additional_address_info)
        self.assertEqual('+9 123654 (updated)', contact_info.phone_number)

    def test_change_company_details_not_logged_in_fails(self):
        self.logout_user()

        self.query_and_assert_error(
            self.MUTATION,
            variables={
                'companyInput': self.DEFAULT_COMPANY_INPUT,
                'contactInfoInput': self.DEFAULT_CONTACT_INFO_INPUT,
            },
            message='not_authenticated',
        )

    def test_change_company_details_user_has_no_company(self):
        self.user.related_company = None
        self.user.save()

        self.query_and_assert_error(
            self.MUTATION,
            variables={
                'companyInput': self.DEFAULT_COMPANY_INPUT,
                'contactInfoInput': self.DEFAULT_CONTACT_INFO_INPUT,
            },
            message='noCompanyAssignedORInactiveCompany',
        )

    def test_change_company_details(self):
        content = self.query_and_load_data(
            self.MUTATION,
            variables={
                'companyInput': self.DEFAULT_COMPANY_INPUT,
                'contactInfoInput': self.DEFAULT_CONTACT_INFO_INPUT,
            },
        )
        self.assertEqual('UPDATED', content['changeCompanyDetails'])
        company = Company.objects.get(id=self.company.id)
        contact_info = company.related_contact_info
        self.assert_default_values(company, contact_info)

    def test_change_company_details_with_existing_contact_info(self):
        contact_info_before_change = baker.make_recipe(
            'company.tests.company_contact_info',
            related_company=self.company,
        )
        country_before_change = contact_info_before_change.country
        content = self.query_and_load_data(
            self.MUTATION,
            variables={
                'companyInput': self.DEFAULT_COMPANY_INPUT,
                'contactInfoInput': self.DEFAULT_CONTACT_INFO_INPUT,
            },
        )
        self.assertEqual('UPDATED', content['changeCompanyDetails'])
        company = Company.objects.get(id=self.company.id)
        contact_info = company.related_contact_info
        self.assertEqual(contact_info.pk, contact_info_before_change.pk)
        self.assertNotEqual(country_before_change, contact_info.country)
        self.assert_default_values(company, contact_info)

    def test_change_company_details_empty_string_for_required_field_fails(self):
        self.query_and_assert_error(
            self.MUTATION,
            variables={
                'companyInput': {
                    **self.DEFAULT_COMPANY_INPUT,
                    'name': '',
                },
                'contactInfoInput': self.DEFAULT_CONTACT_INFO_INPUT,
            },
            message='validationError',
        )

    def test_change_company_details_identification_number_has_spaces_fails(self):
        self.query_and_assert_error(
            self.MUTATION,
            variables={
                'companyInput': {
                    **self.DEFAULT_COMPANY_INPUT,
                    'identificationNumber': '1232 4343',
                },
                'contactInfoInput': self.DEFAULT_CONTACT_INFO_INPUT,
            },
            message='validationError',
        )

    def test_create_company_profile_without_additional_info_no_errors(self):
        content = self.query_and_load_data(
            self.MUTATION,
            variables={
                'companyInput': self.DEFAULT_COMPANY_INPUT,
                'contactInfoInput': {
                    **self.DEFAULT_CONTACT_INFO_INPUT,
                    'postalCode': None,
                    'streetNumber': None,
                    'additionalAddressInfo': None,
                },
            },
        )
        self.assertEqual('UPDATED', content['changeCompanyDetails'])
        company = Company.objects.get(pk=self.company.id)
        contact_info = company.related_contact_info
        self.assertEqual('', contact_info.postal_code)
        self.assertEqual('', contact_info.street_number)
        self.assertEqual('', contact_info.additional_address_info)

    def test_create_company_profile_city_with_whitespaces_clears_value(self):
        content = self.query_and_load_data(
            self.MUTATION,
            variables={
                'companyInput': {
                    key: (f'  {value}  ' if key != 'distributorType' else value)
                    for key, value in self.DEFAULT_COMPANY_INPUT.items()
                },
                'contactInfoInput': {key: f'  {value}  ' for key, value in self.DEFAULT_CONTACT_INFO_INPUT.items()},
            },
        )
        self.assertEqual('UPDATED', content['changeCompanyDetails'])
        company = Company.objects.get(pk=self.company.id)
        contact_info = company.related_contact_info
        self.assert_default_values(company, contact_info)