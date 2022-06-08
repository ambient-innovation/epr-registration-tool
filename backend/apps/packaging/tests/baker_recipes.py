from model_bakery.recipe import Recipe, seq

packaging_group = Recipe(
    'packaging.PackagingGroup',
    name=seq('GROUP_'),
)


packaging_material_price = Recipe(
    'packaging.MaterialPrice',
    start_year=2022,
    start_month=6,
    price_per_kg=10,
)


packaging_material = Recipe(
    'packaging.Material',
    name=seq('MATERIAL_'),
)
