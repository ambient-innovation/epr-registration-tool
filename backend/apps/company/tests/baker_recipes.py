from model_bakery.recipe import Recipe, foreign_key, seq

sector = Recipe('company.Sector', name_en='Food', name_ar='Food_ar')

subsector = Recipe('company.Subsector', name_en='Processed Meat', name_ar='Processed Meat_ar')

company = Recipe(
    'company.Company',
    name='Farwell Co',
    email=seq('farwell', suffix='@local.invalid'),
    registration_number='12345678',
    street_and_house_number='Al-Horriyah 12',
    zip_code=11623,
    city='Mqabalain',
    province='Amman',
    country='Jordan',
    additional_address_info='Second house from the left',
    phone='+962-6-4773466',
    mobile='+962-6-4773467',
    fax='+962-6-4773468',
    sector=foreign_key(sector),
    subsector=foreign_key(subsector),
)
