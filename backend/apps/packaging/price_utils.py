def get_material_price_at(material_id: int, year: int, month: int):
    from packaging.models import MaterialPrice

    sort_key = MaterialPrice.get_sort_key(year, month)
    return (
        MaterialPrice.objects.order_by('sort_key')
        .filter(sort_key__lte=sort_key, related_material_id=material_id)
        .last()
    )
