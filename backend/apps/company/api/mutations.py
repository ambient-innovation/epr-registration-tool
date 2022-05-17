from typing import Optional

from django.core.exceptions import ValidationError
from django.db import transaction

import strawberry
from graphql import GraphQLError

from account.models import User
from company.models import Company


def register_company(
    name: str,
    registration_number: int,
    subsector_ids: list[int],
    street_and_number: str,
    additional_address_info: str,
    zip_code: Optional[int],
    city: str,
    province: str,
    country: str,
    company_email: str,
    phone: str,
    mobile: Optional[str],
    fax: Optional[str],
    user_email: str,
    title: Optional[str],
    full_name: str,
    position: str,
    phone_or_mobile: str,
    password: str,
) -> str:
    company = Company(
        name=name,
        street_and_house_number=street_and_number,
        zip_code=zip_code,
        city=city,
        province=province,
        country=country,
        additional_address_info=additional_address_info,
        phone=phone,
        mobile=mobile,
        fax=fax,
        registration_number=registration_number,
        email=company_email,
    )
    user = User(
        email=user_email,
        full_name=full_name,
        title=title,
        position=position,
        phone_or_mobile=phone_or_mobile,
        related_company=company,
        password=password,
    )
    try:
        company.full_clean()
        user.full_clean()
    except ValidationError as e:
        raise GraphQLError('validation_error', original_error=e)
    with transaction.atomic():
        company.save()
        user.save()
        company.related_subsector.set(subsector_ids)

    return 'Company successfully created!'


@strawberry.type
class RegisterCompanyMutation:
    register_company: str = strawberry.field(resolver=register_company)
