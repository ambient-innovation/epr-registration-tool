import decimal
import typing

from django.db.models import Count

import strawberry
from graphql import GraphQLError
from strawberry.types import Info

from common.api.permissions import IsAuthenticated
from packaging.api.types import PackagingGroupInput
from packaging.price_utils import get_material_price_at
from packaging_report.api.types import PackagingReportType
from packaging_report.models import PackagingReport, TimeframeType


@strawberry.type
class PackagingReportQuery:
    @strawberry.field(permission_classes=[IsAuthenticated])
    @staticmethod
    def packaging_report_fees_estimation(
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
                monthly_quantity = m.quantity / timeframe
                for timeframe_month_index in range(timeframe):
                    month = start_month + timeframe_month_index

                    material_price = get_material_price_at(m.material_id, year, month)
                    if not material_price:
                        raise GraphQLError('materialDoesNotExist')
                    fees = fees + (decimal.Decimal(material_price.price_per_kg) * monthly_quantity)

        return round(fees, 2)

    @strawberry.field(permission_classes=[IsAuthenticated])
    @staticmethod
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
