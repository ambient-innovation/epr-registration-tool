from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import transaction

import strawberry
from graphql import GraphQLError

from account.models import User
from company.models import Company, DistributorType


def register_company(
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
    )
    user = User(
        email=user_email.strip(),
        full_name=user_full_name.strip(),
        title=user_title.strip(),
        position=user_position.strip(),
        phone_or_mobile=user_phone_or_mobile.strip(),
        related_company=company,
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

    return 'CREATED'


@strawberry.type
class RegisterCompanyMutation:
    register_company: str = strawberry.field(resolver=register_company)
