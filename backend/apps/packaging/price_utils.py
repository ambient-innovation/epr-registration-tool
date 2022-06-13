def get_material_price_at(material_id: int, year: int, month: int):
    from packaging.models import MaterialPrice

    sort_key = MaterialPrice.get_sort_key(year, month)
    return (
        MaterialPrice.objects.order_by('sort_key')
        .filter(sort_key__lte=sort_key, related_material_id=material_id)
        .last()
    )


def get_material_latest_price(material_id):
    from django.utils import timezone

    now = timezone.now()
    material_price = get_material_price_at(material_id, now.year, now.month)

    return material_price if material_price else None
