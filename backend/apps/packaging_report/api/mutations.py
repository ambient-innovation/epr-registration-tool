import typing

from django.core.exceptions import ValidationError
from django.db import DatabaseError, transaction

import pytz
import strawberry
from graphql import GraphQLError
from strawberry.types import Info

from account.models import User
from common.api.permissions import IsAuthenticated
from packaging.api.types import PackagingGroupInput
from packaging_report.models import ForecastSubmission, MaterialRecord, PackagingReport, TimeframeType

utc = pytz.UTC


def packaging_report_submit(
    info: Info,
    timeframe: strawberry.enum(TimeframeType),
    year: int,
    start_month: int,
    tz_info: str,
    packaging_records: typing.List[PackagingGroupInput],
) -> str:
    current_user: User = info.context.request.user
    related_company = current_user.related_company
    if not related_company:
        raise GraphQLError('noCompanyAssigned')
    if not related_company.is_active:
        raise GraphQLError('inactiveCompany')

    report = PackagingReport(
        timeframe=timeframe, year=year, start_month=start_month, timezone_info=tz_info, created_by=current_user
    )
    try:
        with transaction.atomic():
            report.full_clean()
            report.save()
            forecast_submission = ForecastSubmission(related_report=report)
            forecast_submission.full_clean()
            forecast_submission.save()
            material_records = []
            for group in packaging_records:
                for material_record in group.material_records:
                    monthly_quantity = material_record.quantity / timeframe
                    monthly_quantities = [monthly_quantity for i in range(timeframe)]
                    material_record = MaterialRecord(
                        related_submission=forecast_submission,
                        related_packaging_group_id=group.packaging_group_id,
                        related_packaging_material_id=material_record.material_id,
                        quantity=material_record.quantity,
                        monthly_quantities=monthly_quantities,
                    )
                    material_record.full_clean()
                    material_records.append(material_record)
            MaterialRecord.objects.bulk_create(material_records)
    except (
        ValidationError,
        DatabaseError,
    ) as e:
        raise GraphQLError('validationError', original_error=e)

    return 'CREATED'


@strawberry.type
class PackagingReportMutation:
    packaging_report_submit: str = strawberry.field(
        resolver=packaging_report_submit, permission_classes=[IsAuthenticated]
    )
