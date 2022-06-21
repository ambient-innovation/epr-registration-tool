import typing

import strawberry
from strawberry.django import auto

from packaging.api.types import MaterialType, PackagingGroupType
from packaging_report.models import ForecastSubmission, MaterialRecord, PackagingReport, TimeframeType


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


@strawberry.django.type(PackagingReport)
class PackagingReportType:
    id: auto
    timeframe: TimeframeType
    year: auto
    start_month: auto
    timezone_info: auto
    created_at: auto

    @strawberry.django.field
    def packaging_groups_count(self, root: PackagingReport) -> int:
        # use prefetched data
        return getattr(root, 'packaging_groups_count', 0)

    @strawberry.django.field
    def forecast(self, root: PackagingReport) -> ForecastSubmissionType:
        # use prefetched data
        return getattr(root, 'forecast', None)
