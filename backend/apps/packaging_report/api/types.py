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
