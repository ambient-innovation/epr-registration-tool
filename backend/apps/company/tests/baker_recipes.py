from model_bakery.recipe import Recipe, foreign_key, seq

sector = Recipe('company.Sector', name=seq('Sector '))

subsector = Recipe('company.Subsector', name=seq('Subsector '))

company = Recipe(
    'company.Company',
    name='Farwell Co',
    sector=foreign_key(sector),
    subsector=foreign_key(subsector),
)
