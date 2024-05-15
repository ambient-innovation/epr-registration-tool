import typing

from django.core.exceptions import ValidationError
from django.db import DatabaseError, transaction
from django.utils import timezone

import strawberry
from graphql import GraphQLError
from sentry_sdk import capture_exception
from strawberry import ID
from strawberry.types import Info

from apps.account.models import User
from apps.common.api.permissions import IsAuthenticated, IsCompanyProfileCompletedAndActive
from apps.company.models import Company
from apps.packaging.api.inputs import PackagingGroupInput
from apps.packaging.models import MaterialPrice
from apps.packaging_report.email import send_packaging_report_invoice
from apps.packaging_report.models import FinalSubmission, ForecastSubmission, MaterialRecord, PackagingReport, TimeframeType


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

    if not packaging_records:
        raise GraphQLError('packagingRecordsEmpty')

    report = PackagingReport(
        timeframe=timeframe,
        year=year,
        start_month=start_month,
        timezone_info=tz_info,
        created_by=current_user,
        related_company=current_user.related_company,
    )

    if len(report.get_overlapping_reports().values('id')):
        raise GraphQLError('timeframeOverlap')

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
    company: Company = current_user.related_company

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

    if not packaging_records:
        raise GraphQLError('packagingRecordsEmpty')
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
        extensions = {}
        if hasattr(e, 'message_dict'):
            extensions['message_dict'] = e.message_dict
        raise GraphQLError(
            'validationError',
            extensions=extensions,
        )

    def _generate_invoice_file(user_pk):
        file = report.generate_invoice_file(user_pk)
        report.invoice_file = file
        report.save()

    _generate_invoice_file(current_user.pk)
    try:
        send_packaging_report_invoice(
            current_user, report, getattr(company, 'related_additional_invoice_recipient', None)
        )
    except Exception as e:
        # failing emails should not break anything else
        capture_exception(e)

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

    if not packaging_records:
        raise GraphQLError('packagingRecordsEmpty')

    forecast_submission_id = report.related_forecast.id

    try:
        with transaction.atomic():
            MaterialRecord.objects.filter(related_forecast_submission_id=forecast_submission_id).delete()
            material_records = clean_material_records_input_for_forecast(forecast_submission_id, packaging_records)
            MaterialRecord.objects.bulk_create(material_records)
    except (ValidationError, DatabaseError) as e:
        raise GraphQLError('validationError', original_error=e)

    return 'UPDATED'


def packaging_report_forecast_delete(info: Info, packaging_report_id: ID):
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
    if not getattr(report, 'related_forecast', None) or not report.is_forecast_editable():
        raise GraphQLError('reportIsNotDeletable')

    report.delete()

    return 'DELETED'


@strawberry.type
class PackagingReportMutation:
    packaging_report_forecast_submit: str = strawberry.field(
        resolver=packaging_report_forecast_submit,
        permission_classes=[IsAuthenticated, IsCompanyProfileCompletedAndActive],
    )
    packaging_report_final_data_submit: str = strawberry.field(
        resolver=packaging_report_final_data_submit,
        permission_classes=[IsAuthenticated, IsCompanyProfileCompletedAndActive],
    )
    packaging_report_forecast_update: str = strawberry.field(
        resolver=packaging_report_forecast_update,
        permission_classes=[IsAuthenticated, IsCompanyProfileCompletedAndActive],
    )
    packaging_report_forecast_delete: str = strawberry.field(
        resolver=packaging_report_forecast_delete,
        permission_classes=[IsAuthenticated, IsCompanyProfileCompletedAndActive],
    )
