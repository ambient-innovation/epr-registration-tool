import typing
from typing import Optional

import strawberry
from strawberry.django import auto

from common.api.types import ImageType
from company.models import Company, CompanyContactInfo


@strawberry.django.type(Company)
class CompanyType:
    id: auto
    name: auto
    registration_number: auto
    distributor_type: auto
    lastmodified_at: auto
    created_at: auto
    identification_number: auto
    is_profile_completed: bool

    @strawberry.django.field
    def is_profile_completed(self, root: Company) -> bool:
        return getattr(root, 'is_profile_completed', False)

    @strawberry.django.field
    def logo(self, root) -> typing.Optional[ImageType]:
        if root.logo:
            return root.logo
        return None


@strawberry.django.input(CompanyContactInfo)
class CompanyProfileInputType:
    country: str
    postal_code: Optional[str]
    city: str
    street: str
    street_number: Optional[str]
    phone_number: str
    additional_address_info: Optional[str]
