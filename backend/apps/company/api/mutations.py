import typing
from typing import Optional

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import translation

import strawberry
from graphql import GraphQLError
from sentry_sdk import capture_exception
from strawberry.file_uploads import Upload
from strawberry.types import Info

from apps.account.email import send_user_confirm_email_notification
from apps.account.models import User
from apps.common.api.permissions import IsActivated, IsAuthenticated
from apps.company.api.inputs import AdditionalInvoiceRecipientInput, CompanyContactInfoInput, CompanyInput
from apps.company.email import send_company_data_changed_notification
from apps.company.models import AdditionalInvoiceRecipient, Company, CompanyContactInfo, DistributorType
from apps.company.utils import generate_unique_registration_number


def register_company(
    info: Info,
    company_name: str,
    company_distributor_type: strawberry.enum(DistributorType),
    user_email: str,
    user_title: str,
    user_full_name: str,
    user_position: str,
    user_phone_or_mobile: str,
    password: str,
    country_code: str,
) -> str:
    company = Company(
        name=company_name.strip(),
        distributor_type=company_distributor_type,
        is_active=False,
        country_code=country_code.strip().lower(),
        # add dummy registration number to satisfy validation
        # --> generate actual registration number, once the company is validated
        registration_number='XY0123456789',
    )

    selected_language = translation.get_language_from_request(info.context.request)

    user = User(
        email=user_email.strip(),
        full_name=user_full_name.strip(),
        title=user_title.strip(),
        position=user_position.strip(),
        phone_or_mobile=user_phone_or_mobile.strip(),
        related_company=company,
        language_preference=selected_language,
        is_active=True,
        has_email_confirmed=False,
    )
    user.set_password(password)

    # check model validation
    try:
        company.full_clean()
        user.full_clean()
    except ValidationError as e:
        if 'email' in e.error_dict:
            code = e.error_dict['email'][0].code
            if code == "unique":
                # email uniqueness constraint violated
                error_code = 'userEmailDoesAlreadyExist'
            else:
                # email is invalid
                error_code = 'validationError'
        else:
            # other validation errors
            error_code = 'validationError'
        raise GraphQLError(error_code, original_error=e)

    # check password
    try:
        validate_password(password)
    except ValidationError as e:
        raise GraphQLError(e.error_list[0].code, original_error=e)

    # generate registration_number AFTER validation of company
    company.registration_number = generate_unique_registration_number(company)

    with transaction.atomic():
        company.save()
        user.save()
        company.created_by_id = user.id
        company.save()

    try:
        send_user_confirm_email_notification(user)
    except Exception as e:
        # failing emails should not break the registration
        capture_exception(e)

    return 'CREATED'


def change_company_details(
    info: Info,
    company_input: CompanyInput,
    contact_info_input: CompanyContactInfoInput,
    additional_invoice_recipient_input: typing.Optional[AdditionalInvoiceRecipientInput],
) -> str:
    user = info.context.request.user
    company = user.related_company

    try:
        contact_info = company.related_contact_info
    except CompanyContactInfo.DoesNotExist:
        contact_info = CompanyContactInfo(related_company=company)

    if not company_input.identification_number:
        raise GraphQLError('identificationNumberRequired')

    company_input_data = vars(company_input)
    contact_info_input_data = vars(contact_info_input)
    additional_invoice_recipient_data = (
        vars(additional_invoice_recipient_input) if additional_invoice_recipient_input else {}
    )

    additional_invoice_recipient_delete = not bool(additional_invoice_recipient_data)
    additional_invoice_recipient = None
    try:
        additional_invoice_recipient = company.related_additional_invoice_recipient
    except AdditionalInvoiceRecipient.DoesNotExist:
        if bool(additional_invoice_recipient_data):
            additional_invoice_recipient = AdditionalInvoiceRecipient(related_company=company)

    for key, value in additional_invoice_recipient_data.items():
        assert hasattr(additional_invoice_recipient, key), f'AdditionalInvoiceRecipient has no attribute {key}'
        setattr(additional_invoice_recipient, key, value.strip() if value else '')

    for key, value in company_input_data.items():
        assert hasattr(company, key), f'Company has no attribute {key}'
        setattr(company, key, value.strip() if value else '')

    for key, value in contact_info_input_data.items():
        assert hasattr(contact_info, key), f'CompanyContactInfo has no attribute {key}'
        setattr(contact_info, key, value.strip() if value else '')

    try:
        company.full_clean()
        contact_info.full_clean()
        if additional_invoice_recipient and not additional_invoice_recipient_delete:
            additional_invoice_recipient.full_clean()
    except ValidationError as e:
        if len([error for error in e.error_dict.get('identification_number', []) if error.code == 'unique']):
            raise GraphQLError('identificationNumberAlreadyExists')
        raise GraphQLError('validationError', original_error=e)

    with transaction.atomic():
        additional_invoice_recipient and not additional_invoice_recipient_delete and additional_invoice_recipient.save()
        additional_invoice_recipient and additional_invoice_recipient_delete and additional_invoice_recipient.delete()
        contact_info.save()
        company.save()

    try:
        send_company_data_changed_notification(company)
    except Exception as e:
        # failing emails should not break the registration
        capture_exception(e)

    return 'UPDATED'


def change_company_logo(info: Info, file: Optional[Upload] = None) -> str:
    user = info.context.request.user
    company = user.related_company

    try:
        if not file:
            company.logo.delete()
        else:
            company.update_logo(file)

        company.full_clean()
    except ValidationError as e:
        if 'logo' in e.error_dict:
            code = e.error_dict['logo'][0].code
        else:
            # other validation errors
            code = 'validationError'
        raise GraphQLError(code, original_error=e)

    with transaction.atomic():
        company.save()

    return "UPDATED"


@strawberry.type
class RegisterCompanyMutation:
    register_company: str = strawberry.field(resolver=register_company)
    change_company_details: str = strawberry.field(
        resolver=change_company_details, permission_classes=[IsAuthenticated, IsActivated]
    )
    change_company_logo: str = strawberry.field(
        resolver=change_company_logo, permission_classes=[IsAuthenticated, IsActivated]
    )
