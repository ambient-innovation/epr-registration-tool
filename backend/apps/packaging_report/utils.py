import typing
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db.models import Q

from apps.packaging.price_utils import calculate_material_fees


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


def get_overlapping_reports_for_timeframe(
    company_id, year: int, start_month: int, timeframe: int, exclude_report_id=None
):
    """
    return reports which overlap with this report in timeframe
    """
    from apps.packaging_report.models import PackagingReport

    return (
        PackagingReport.objects
        # should be in the same year and company
        .filter(year=year, related_company_id=company_id)
        .annotate_end_month()
        .filter(
            # starts between [current_start, current_end-1]
            Q(start_month__range=(start_month, start_month + (timeframe - 1)))
            # OR ends between [current_start, current_end]
            | Q(end_month__range=(start_month, start_month + timeframe))
            # OR (starts < current_start AND end > current_end)
            | Q(start_month__lt=start_month, end_month__gt=start_month + (timeframe - 1))
            # OR start = current_start
            | Q(start_month=start_month)
            # OR end = current_end
            | Q(end_month=start_month + (timeframe - 1))
        )
        .exclude(pk=exclude_report_id)
    )
