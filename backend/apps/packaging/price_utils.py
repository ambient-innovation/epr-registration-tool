from decimal import Decimal

from django.core.exceptions import ValidationError

from packaging_report.models import TimeframeType


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


def calculate_material_fees(
    timeframe: TimeframeType,
    year: int,
    start_month: int,
    material_id: int,
    material_quantity: Decimal,
) -> Decimal:
    fees = 0
    monthly_quantity = material_quantity / timeframe
    for timeframe_month_index in range(timeframe):
        month = start_month + timeframe_month_index

        material_price = get_material_price_at(material_id, year, month)
        if not material_price:
            raise ValidationError('materialDoesNotExist')
        fees = fees + (Decimal(material_price.price_per_kg) * Decimal(monthly_quantity))
    return fees
