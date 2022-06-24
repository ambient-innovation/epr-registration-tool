from model_bakery.recipe import Recipe

company_contact_info = Recipe(
    'company.CompanyContactInfo',
    country='Jordan',
    postal_code='12345',
    city='Amman',
    street='Street',
    street_number='10',
    phone_number='+9 123654',
    additional_address_info="the big building above the grocery,second floor , the green door!",
)

company = Recipe(
    'company.Company',
    name='Farwell Co',
    distributor_type='IMPORTER',
    is_active=True,
    identification_number="DE1235458",
)
