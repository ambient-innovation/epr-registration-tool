import strawberry
from strawberry.django import auto

from packaging_report.models import PackagingReport


@strawberry.django.type(PackagingReport)
class PackagingReportType:
    id: auto
    timeframe: auto
    year: auto
    start_month: auto
    timezone_info: auto
    created_at: auto

    @strawberry.django.field
    def packaging_groups_count(self, root: PackagingReport) -> int:
        return getattr(root, 'packaging_groups_count', 0)
