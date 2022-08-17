import decimal
import typing
from decimal import InvalidOperation

from django.db.models import Case, Count, FloatField, Prefetch, When

import strawberry
from graphql import GraphQLError
from strawberry import ID
from strawberry.types import Info

from common.api.pagination import CustomPaginator, PaginationInput, PaginationResult, PaginatorType
from common.api.permissions import IsAuthenticated, IsCompanyProfileCompletedAndActive
from packaging.api.inputs import PackagingGroupInput
from packaging_report.api.inputs import PackagingReportsFilterInput
from packaging_report.api.types import PackagingReportsSortingOption, PackagingReportType
from packaging_report.models import PackagingReport, TimeframeType


def get_packaging_report_fees_estimation(
    timeframe: strawberry.enum(TimeframeType),
    year: int,
    start_month: int,
    packaging_records: typing.List[PackagingGroupInput],
) -> decimal.Decimal:
    from packaging_report.utils import calculate_fees

    material_quantities = [(int(m.material_id), m.quantity) for p in packaging_records for m in p.material_records]
    try:
        return calculate_fees(
            timeframe=timeframe,
            year=year,
            start_month=start_month,
            material_quantities=material_quantities,
        )
    except InvalidOperation:
        raise GraphQLError('materialQuantityInvalidDecimal')


def has_overlapping_packaging_reports(
    info: Info,
    timeframe: strawberry.enum(TimeframeType),
    year: int,
    start_month: int,
) -> bool:
    from packaging_report.utils import get_overlapping_reports_for_timeframe

    current_user = info.context.request.user
    related_company_id = current_user.related_company_id
    return get_overlapping_reports_for_timeframe(
        company_id=related_company_id, year=year, start_month=start_month, timeframe=timeframe
    ).exists()


DEFAULT_PACKAGING_REPORTS_LIMIT = 12


def packaging_reports(
    info: Info,
    pagination: typing.Optional[PaginationInput] = None,
    filter: typing.Optional[PackagingReportsFilterInput] = None,
    sorting: typing.Optional[PackagingReportsSortingOption] = PackagingReportsSortingOption.NEWEST_FIRST,
) -> PaginationResult[PackagingReportType]:
    current_user = info.context.request.user

    if not current_user.related_company_id:
        base_queryset = PackagingReport.objects.none()
    else:
        base_queryset = PackagingReport.objects.visible_for(current_user)

    if filter and filter.year:
        base_queryset = base_queryset.filter(year=filter.year)

    order_by = (
        ('year', 'start_month') if sorting == PackagingReportsSortingOption.OLDEST_FIRST else ('-year', '-start_month')
    )

    packaging_reports_queryset = base_queryset.annotate(
        final_fees=Case(
            When(related_final_submission__isnull=False, then='related_final_submission__fees'),
            default=None,
            output_field=FloatField(),
        ),
        packaging_groups_count=Case(
            # material_records count depends on report state
            When(
                related_final_submission__isnull=True,
                then=Count('related_forecast__material_records_queryset__related_packaging_group', distinct=True),
            ),
            default=Count(
                'related_final_submission__material_records_queryset__related_packaging_group', distinct=True
            ),
        ),
    ).order_by(*order_by)

    if pagination:
        if pagination.limit < 1 or pagination.limit > 100:
            raise GraphQLError('invalidLimit')
        else:
            limit = pagination.limit
        if pagination.page < 1:
            raise GraphQLError('invalidPage')
        else:
            page_number = pagination.page
    else:
        limit = DEFAULT_PACKAGING_REPORTS_LIMIT
        page_number = 1

    paginator = CustomPaginator(packaging_reports_queryset, limit, count_queryset=base_queryset)
    page = paginator.get_page(page_number)

    return PaginationResult(
        items=page,
        page_info=PaginatorType(
            current_page=page.number,
            per_page=paginator.per_page,
            num_pages=paginator.num_pages,
            total_count=paginator.count,
            has_next_page=page.has_next(),
        ),
    )


def packaging_report_forecast_details(info: Info, packaging_report_id: ID) -> typing.Optional[PackagingReportType]:
    current_user = info.context.request.user

    return (
        PackagingReport.objects.visible_for(current_user)
        .filter(pk=packaging_report_id)
        .prefetch_related(
            Prefetch('related_forecast', to_attr='forecast'),
            Prefetch('related_final_submission', to_attr='final_submission'),
            Prefetch('forecast__material_records_queryset', to_attr='material_records'),
            Prefetch('forecast__material_records__related_packaging_material', to_attr='material'),
            Prefetch('forecast__material_records__related_packaging_group', to_attr='packaging_group'),
        )
        .first()
    )


def packaging_report_final_details(info: Info, packaging_report_id: ID) -> typing.Optional[PackagingReportType]:
    current_user = info.context.request.user

    return (
        PackagingReport.objects.visible_for(current_user)
        .filter(pk=packaging_report_id)
        .annotate(
            final_fees=Case(
                When(related_final_submission__isnull=False, then='related_final_submission__fees'),
                default=None,
                output_field=FloatField(),
            ),
        )
        .prefetch_related(
            Prefetch('related_forecast', to_attr='forecast'),
            Prefetch('related_final_submission', to_attr='final_submission'),
            Prefetch('final_submission__material_records_queryset', to_attr='material_records'),
            Prefetch('final_submission__material_records__related_packaging_material', to_attr='material'),
            Prefetch('final_submission__material_records__related_packaging_group', to_attr='packaging_group'),
        )
        .first()
    )


@strawberry.type
class Query:
    packaging_report_fees_estimation = strawberry.field(
        resolver=get_packaging_report_fees_estimation, permission_classes=[IsAuthenticated]
    )
    has_overlapping_packaging_reports = strawberry.field(
        resolver=has_overlapping_packaging_reports, permission_classes=[IsCompanyProfileCompletedAndActive]
    )
    packaging_reports = strawberry.field(resolver=packaging_reports, permission_classes=[IsAuthenticated])
    packaging_report_forecast_details = strawberry.field(
        resolver=packaging_report_forecast_details,
        permission_classes=[IsAuthenticated, IsCompanyProfileCompletedAndActive],
    )
    packaging_report_final_details = strawberry.field(
        resolver=packaging_report_final_details,
        permission_classes=[IsAuthenticated, IsCompanyProfileCompletedAndActive],
    )
