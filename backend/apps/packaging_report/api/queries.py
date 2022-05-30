import decimal
import typing

import strawberry
from graphql import GraphQLError

from packaging.api.types import PackagingGroupInput
from packaging.price_utils import get_material_price_at
from packaging_report.models import TimeframeType


@strawberry.type
class PackagingReportQuery:
    @strawberry.field
    def packaging_report_fees_estimation(
        self,
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
                    fees = fees + (material_price.price_per_kg * monthly_quantity)

        return round(fees, 2)
