import decimal
import typing

import strawberry
from django.db.models import Count
from strawberry import ID
from strawberry.types import Info

from common.api.permissions import IsAuthenticated
from packaging.api.types import PackagingGroupInput
from packaging.price_utils import calculate_material_fees
from packaging_report.api.types import PackagingReportType
from packaging_report.models import PackagingReport, TimeframeType


def get_packaging_report_fees_estimation(
        info: Info,
        timeframe: strawberry.enum(TimeframeType),
        year: int,
        start_month: int,
        packaging_records: typing.List[PackagingGroupInput],
    ) -> decimal.Decimal:
    if not packaging_records:
        return 0.0

    fees = 0
    for packaging in packaging_records:
        for m in packaging.material_records:
            fees = fees + calculate_material_fees(timeframe, year, start_month, m.material_id, m.quantity)
    return round(fees, 2)


def packaging_reports(info: Info) -> typing.List[PackagingReportType]:
    user = info.context.request.user

    if not user.related_company_id:
        return PackagingReport.objects.none()

    all_reports = PackagingReport.objects.filter(related_company_id=user.related_company_id).annotate(
        packaging_groups_count=Count(
            'related_forecast__material_records_queryset__related_packaging_group', distinct=True
        )
    )
    return all_reports

@strawberry.type
class Query:
    packaging_report_fees_estimation = strawberry.field(
        resolver=get_packaging_report_fees_estimation, permission_classes=[IsAuthenticated]
    )
    packaging_reports = strawberry.field(
        resolver=packaging_reports, permission_classes=[IsAuthenticated]
    )
