import typing

from django.core.exceptions import ValidationError
from django.db import DatabaseError, transaction
from django.utils import timezone

import strawberry
from graphql import GraphQLError
from strawberry import ID
from strawberry.types import Info

from account.models import User
from common.api.permissions import IsActivated, IsAuthenticated
from packaging.api.types import PackagingGroupInput
from packaging.models import MaterialPrice
from packaging_report.models import FinalSubmission, ForecastSubmission, MaterialRecord, PackagingReport, TimeframeType


def clean_material_records_input_for_forecast(
    forecast_submission_id, packaging_records_input: typing.List[PackagingGroupInput]
) -> typing.List[MaterialRecord]:
    material_records = []
    for group in packaging_records_input:
        for material_record in group.material_records:
            material_record = MaterialRecord(
                related_forecast_submission_id=forecast_submission_id,
                related_packaging_group_id=group.packaging_group_id,
                related_packaging_material_id=material_record.material_id,
                quantity=material_record.quantity,
            )
            material_record.full_clean()
            material_records.append(material_record)
    return material_records


def clean_material_records_input_for_final_report(
    final_submission_id, packaging_records_input: typing.List[PackagingGroupInput]
) -> typing.List[MaterialRecord]:
    material_records = []
    for group in packaging_records_input:
        for material_record in group.material_records:
            material_record = MaterialRecord(
                related_final_submission_id=final_submission_id,
                related_packaging_group_id=group.packaging_group_id,
                related_packaging_material_id=material_record.material_id,
                quantity=material_record.quantity,
            )
            material_record.full_clean()
            material_records.append(material_record)
    return material_records


def packaging_report_forecast_submit(
    info: Info,
    timeframe: strawberry.enum(TimeframeType),
    year: int,
    start_month: int,
    tz_info: str,
    packaging_records: typing.List[PackagingGroupInput],
) -> str:
    current_user: User = info.context.request.user
    now = timezone.now()
    report_date_key = MaterialPrice.get_sort_key(year, start_month)
    now_date_key = MaterialPrice.get_sort_key(now.year, now.month)
    # report should start at earliest next month
    if now_date_key >= report_date_key:
        raise GraphQLError('startDateIsInvalid')

    report = PackagingReport(
        timeframe=timeframe,
        year=year,
        start_month=start_month,
        timezone_info=tz_info,
        created_by=current_user,
        related_company=current_user.related_company,
    )
    try:
        with transaction.atomic():
            report.full_clean()
            report.save()
            forecast_submission = ForecastSubmission(related_report=report)
            forecast_submission.full_clean()
            forecast_submission.save()
            material_records = clean_material_records_input_for_forecast(forecast_submission.id, packaging_records)
            MaterialRecord.objects.bulk_create(material_records)
    except (
        ValidationError,
        DatabaseError,
    ) as e:
        raise GraphQLError('validationError', extensions={'message_dict': getattr(e, 'message_dict', {})})

    return 'CREATED'


def packaging_report_final_data_submit(
    info: Info,
    packaging_report_id: ID,
    packaging_records: typing.List[PackagingGroupInput],
) -> str:
    current_user: User = info.context.request.user

    report: PackagingReport = PackagingReport.objects.visible_for(current_user).filter(pk=packaging_report_id).first()
    if not report:
        raise GraphQLError('reportDoesNotExist')

    related_forecast = getattr(report, 'related_forecast', None)

    # for some reason there is no forecast (deleted by admin!)
    if not related_forecast:
        raise GraphQLError('reportIsNotEditable')

    # still in forecast timeframe
    if report.is_forecast_editable():
        raise GraphQLError('cannotSubmitFinalReportYet')
    # already has final report
    if getattr(report, 'related_final_submission', None):
        raise GraphQLError('finalReportAlreadySubmitted')

    try:
        with transaction.atomic():
            final_submission = FinalSubmission(related_report=report)
            final_submission.full_clean()
            final_submission.save()
            material_records = clean_material_records_input_for_final_report(final_submission.id, packaging_records)
            MaterialRecord.objects.bulk_create(material_records)
            final_submission.fees = final_submission.calculate_fees(report, material_records)
            final_submission.save()
    except (ValidationError, DatabaseError) as e:
        raise GraphQLError('validationError', extensions={'message_dict': getattr(e, 'message_dict', {})})

    return 'CREATED'


def packaging_report_forecast_update(
    info: Info,
    packaging_report_id: ID,
    packaging_records: typing.List[PackagingGroupInput],
) -> str:
    current_user: User = info.context.request.user

    report: PackagingReport = (
        PackagingReport.objects.visible_for(current_user)
        .filter(pk=packaging_report_id)
        .select_related('related_forecast')
        .first()
    )
    if not report:
        raise GraphQLError('reportDoesNotExist')

    # check if this report is editable at this time
    if not report.is_forecast_editable():
        raise GraphQLError('reportIsNotEditable')

    if not getattr(report, 'related_forecast', None):
        raise GraphQLError('reportIsNotEditable')

    forecast_submission_id = report.related_forecast.id

    try:
        with transaction.atomic():
            MaterialRecord.objects.filter(related_forecast_submission_id=forecast_submission_id).delete()
            material_records = clean_material_records_input_for_forecast(forecast_submission_id, packaging_records)
            MaterialRecord.objects.bulk_create(material_records)
    except (ValidationError, DatabaseError) as e:
        raise GraphQLError('validationError', original_error=e)

    return 'UPDATED'


@strawberry.type
class PackagingReportMutation:
    packaging_report_forecast_submit: str = strawberry.field(
        resolver=packaging_report_forecast_submit, permission_classes=[IsAuthenticated, IsActivated]
    )
    packaging_report_final_data_submit: str = strawberry.field(
        resolver=packaging_report_final_data_submit, permission_classes=[IsAuthenticated, IsActivated]
    )
    packaging_report_forecast_update: str = strawberry.field(
        resolver=packaging_report_forecast_update, permission_classes=[IsAuthenticated, IsActivated]
    )
