from __future__ import annotations

from typing import Optional

from packaging.models import MaterialPrice


def get_price(material_id: int, year: int, month: int) -> Optional[MaterialPrice]:
    sort_key = year * 100 + month
    return (
        MaterialPrice.objects.order_by('sort_key')
        .filter(sort_key__lte=sort_key, related_material_id=material_id)
        .last()
    )
