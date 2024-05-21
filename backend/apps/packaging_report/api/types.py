import datetime
import decimal
import typing
from enum import Enum

import strawberry
from strawberry import auto
from strawberry_django import DjangoFileType

from apps.packaging.api.types import MaterialType, PackagingGroupType
from apps.packaging_report.models import (
    FinalSubmission,
    ForecastSubmission,
    MaterialRecord,
    PackagingReport,
    TimeframeType,
)


@strawberry.django.type(MaterialRecord)
class MaterialRecordType:
    id: auto
    quantity: auto

    @strawberry.django.field
    def material(self, root: ForecastSubmission) -> MaterialType:
        # use prefetched data
        return getattr(root, 'material')

    @strawberry.django.field
    def packaging_group(self, root: ForecastSubmission) -> PackagingGroupType:
        # use prefetched data
        return getattr(root, 'packaging_group')


@strawberry.django.type(ForecastSubmission)
class ForecastSubmissionType:
    id: auto

    @strawberry.django.field
    def material_records(self, root: ForecastSubmission) -> typing.List[MaterialRecordType]:
        # use prefetched data
        return getattr(root, 'material_records', [])


@strawberry.django.type(FinalSubmission)
class FinalSubmissionType:
    id: auto
    fees: auto

    @strawberry.django.field
    def material_records(self, root: FinalSubmission) -> typing.List[MaterialRecordType]:
        # use prefetched data
        return getattr(root, 'material_records', [])


@strawberry.django.type(PackagingReport)
class PackagingReportType:
    id: auto
    timeframe: strawberry.enum(TimeframeType)
    year: auto
    start_month: auto
    timezone_info: auto
    created_at: auto
    is_paid: auto

    @strawberry.django.field
    def end_datetime(self, root) -> datetime.datetime:
        return root.end_datetime

    @strawberry.django.field
    def invoice_file(self, root) -> typing.Optional[DjangoFileType]:
        if root.invoice_file:
            return root.invoice_file
        return None

    @strawberry.django.field
    def packaging_groups_count(self, root: PackagingReport) -> int:
        # use prefetched data
        return getattr(root, 'packaging_groups_count', 0)

    @strawberry.django.field
    def forecast(self, root: PackagingReport) -> typing.Optional[ForecastSubmissionType]:
        # use prefetched data
        return getattr(root, 'forecast', None)

    @strawberry.django.field
    def final_report(self, root: PackagingReport) -> typing.Optional[FinalSubmissionType]:
        # use prefetched data
        return getattr(root, 'final_submission', None)

    @strawberry.django.field
    def is_forecast_editable(self, root: PackagingReport) -> bool:
        return root.is_forecast_editable()

    @strawberry.django.field
    def is_final_report_submitted(self, root: PackagingReport) -> bool:
        # use annotated data
        return bool(getattr(root, 'final_fees', False))

    @strawberry.django.field
    def fees(self, root: PackagingReport) -> typing.Optional[decimal.Decimal]:
        # use prefetched data
        return getattr(root, 'final_fees', None)


@strawberry.enum
class PackagingReportsSortingOption(Enum):
    NEWEST_FIRST = 'NEWEST_FIRST'
    OLDEST_FIRST = 'OLDEST_FIRST'
