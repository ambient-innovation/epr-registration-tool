from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import transaction

import strawberry
from graphql import GraphQLError

from account.models import User
from company.models import Company, Subsector


def register_company(
    company_name: str,
    subsector_ids: list[int],
    user_email: str,
    user_title: str,
    user_full_name: str,
    user_position: str,
    user_phone_or_mobile: str,
    password: str,
) -> str:
    company = Company(
        name=company_name.strip(),
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
        if 'email' in e.message_dict:
            error_code = 'userEmailDoesAlreadyExist'
        else:
            error_code = 'validationError'
        raise GraphQLError(error_code, original_error=e)

    # check subsectors
    subsectors = Subsector.objects.filter(id__in=subsector_ids).only('id', 'related_sector_id')
    sector_ids_set = {subsector.related_sector_id for subsector in subsectors}
    if len(sector_ids_set) > 1:
        # all subsectors must belong to the same sector
        raise GraphQLError('invalidSubsectorSelection')
    existing_subsector_ids = [subsector.id for subsector in subsectors]
    if len(existing_subsector_ids) == 0:
        # at least one subsector must be selected
        raise GraphQLError('invalidSubsectorSelection')

    # check password
    try:
        validate_password(password)
    except ValidationError as e:
        raise GraphQLError(e.error_list[0].code, original_error=e)

    with transaction.atomic():
        company.save()
        user.save()
        company.related_subsector.set(subsector_ids)

    return 'Company successfully created!'


@strawberry.type
class RegisterCompanyMutation:
    register_company: str = strawberry.field(resolver=register_company)
