import typing
from decimal import Decimal

from django.core.exceptions import ValidationError

from packaging.price_utils import calculate_material_fees


def calculate_fees(
    timeframe,
    start_month: int,
    year: int,
    material_quantities: typing.List[typing.Tuple[int, Decimal]],
    raise_exception=True,
):
    fees = Decimal(0)

    for (material_id, quantity) in material_quantities:
        try:
            material_fees = calculate_material_fees(
                timeframe,
                year,
                start_month,
                material_id,
                quantity,
            )
        except ValidationError as e:
            if raise_exception:
                raise e
            else:
                material_fees = 0

        fees = fees + material_fees

    return round(fees, 2)
