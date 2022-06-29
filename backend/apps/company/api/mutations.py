from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import translation

import strawberry
from graphql import GraphQLError
from sentry_sdk import capture_exception
from strawberry.types import Info
from strawberry_django.mutations.fields import get_input_data

from account.email import send_user_activation_notification
from account.models import User
from common.api.permissions import IsActivated, IsAuthenticated
from company.api.types import CompanyProfileInputType
from company.models import Company, CompanyContactInfo, DistributorType
from company.validators import validate_string_without_whitespaces


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
) -> str:
    company = Company(
        name=company_name.strip(),
        distributor_type=company_distributor_type,
        is_active=False,
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
        is_active=False,
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

    with transaction.atomic():
        company.save()
        user.save()
        company.created_by_id = user.id
        company.save()

    try:
        send_user_activation_notification(user)
    except Exception as e:
        # failing emails should not break the registration
        capture_exception(e)

    return 'CREATED'


def create_company_profile(info: Info, profile_data: CompanyProfileInputType, identification_number: str) -> str:
    user = info.context.request.user
    company = user.related_company

    profile_data_dict = {
        key: value and value.strip() for key, value in get_input_data(CompanyProfileInputType, profile_data).items()
    }

    # for edit case this can be removed and this can be used as edit directly
    if hasattr(company, 'related_contact_info'):
        raise GraphQLError('profileAlreadyCompleted')

    try:
        validate_string_without_whitespaces(identification_number)
    except ValidationError as e:
        raise GraphQLError(e.error_list[0].code, original_error=e)

    company_contact_info = CompanyContactInfo(**profile_data_dict, related_company_id=company.id)

    try:
        company.full_clean()
    except ValidationError as e:
        raise GraphQLError('validationError', original_error=e)

    with transaction.atomic():
        company_contact_info.save()
        company.identification_number = identification_number
        company.save()

    return 'CREATED'


@strawberry.type
class RegisterCompanyMutation:
    register_company: str = strawberry.field(resolver=register_company)
    create_company_profile: str = strawberry.field(
        resolver=create_company_profile, permission_classes=[IsAuthenticated, IsActivated]
    )
