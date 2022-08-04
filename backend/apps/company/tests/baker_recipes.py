from model_bakery import seq
from model_bakery.recipe import Recipe

from company.utils import REGISTRATION_NUMBER_MIN

company_contact_info = Recipe(
    'company.CompanyContactInfo',
    country='Jordan',
    postal_code='12345',
    city='Amman',
    street='Street',
    street_number='10',
    additional_address_info="the big building above the grocery,second floor , the green door!",
    phone_number='+9 123654',
)

additional_invoice_recipient = Recipe(
    'company.AdditionalInvoiceRecipient',
    email=seq('invoice_recipient', suffix='@local.local'),
    phone_or_mobile='+9 123654',
    full_name='Bean',
    title='mr',
)

company = Recipe(
    'company.Company',
    name='Farwell Co',
    distributor_type='IMPORTER',
    is_active=True,
    identification_number="DE1235458",
    registration_number=seq('DE', start=REGISTRATION_NUMBER_MIN),
)
