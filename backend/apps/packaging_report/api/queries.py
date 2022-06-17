import decimal
import typing

from django.db.models import Count

import strawberry
from strawberry import ID
from strawberry.types import Info

from common.api.permissions import IsActivated, IsAuthenticated
from packaging.api.types import PackagingGroupInput
from packaging.price_utils import calculate_material_fees
from packaging_report.api.types import PackagingReportType
from packaging_report.models import PackagingReport, TimeframeType


def get_packaging_report_fees_estimation(
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
    current_user = info.context.request.user

    if not current_user.related_company_id:
        return PackagingReport.objects.none()

    all_reports = PackagingReport.objects.visible_for(current_user).annotate(
        packaging_groups_count=Count(
            'related_forecast__material_records_queryset__related_packaging_group', distinct=True
        )
    )
    return all_reports


def packaging_report_forecast_details(info: Info, packaging_report_id: ID) -> typing.Optional[PackagingReportType]:
    current_user = info.context.request.user

    return (
        PackagingReport.objects.visible_for(current_user)
        .filter(pk=packaging_report_id)
        .select_related('related_forecast')
        .prefetch_related(
            'related_forecast__material_records_queryset',
        )
        .first()
    )


@strawberry.type
class Query:
    packaging_report_fees_estimation = strawberry.field(
        resolver=get_packaging_report_fees_estimation, permission_classes=[IsAuthenticated]
    )
    packaging_reports = strawberry.field(resolver=packaging_reports, permission_classes=[IsAuthenticated])
    packaging_report_forecast_details = strawberry.field(
        resolver=packaging_report_forecast_details, permission_classes=[IsAuthenticated, IsActivated]
    )
