import typing

import strawberry
from strawberry.django import auto

from packaging.api.types import MaterialType, PackagingGroupType
from packaging_report.models import ForecastSubmission, MaterialRecord, PackagingReport, TimeframeType


@strawberry.django.type(MaterialRecord)
class MaterialRecordType:
    id: auto
    quantity: auto
    related_packaging_group: PackagingGroupType
    related_packaging_material: MaterialType


@strawberry.django.type(ForecastSubmission)
class ForecastSubmissionType:
    id: auto

    @strawberry.django.field
    def material_records(self, root: ForecastSubmission) -> typing.List[MaterialRecordType]:
        return root.material_records_queryset.select_related(
            'related_packaging_material', 'related_packaging_group'
        ).all()


@strawberry.django.type(PackagingReport)
class PackagingReportType:
    id: auto
    timeframe: TimeframeType
    year: auto
    start_month: auto
    timezone_info: auto
    related_forecast: ForecastSubmissionType
    created_at: auto

    @strawberry.django.field
    def packaging_groups_count(self, root: PackagingReport) -> int:
        return getattr(root, 'packaging_groups_count', 0)
