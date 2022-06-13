from typing import Optional

import strawberry
from strawberry.django import auto

from company.models import Company, CompanyContactInfo


@strawberry.django.type(Company)
class CompanyType:
    id: auto
    name: auto
    distributor_type: auto
    lastmodified_at: auto
    created_at: auto
    identification_number: auto

    @strawberry.django.field
    def is_profile_completed(self, root: Company) -> bool:
        return getattr(root, 'is_profile_completed', False)


@strawberry.django.input(CompanyContactInfo)
class CompanyProfileInputType:
    country: str
    postal_code: Optional[str]
    city: str
    street: str
    street_number: Optional[str]
    phone_number: str
    additional_address_info: Optional[str]
