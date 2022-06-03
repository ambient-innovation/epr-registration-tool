import strawberry
from strawberry.django import auto

from company.models import Company


@strawberry.django.type(Company)
class CompanyType:
    id: auto
    name: auto
    distributor_type: auto
    lastmodified_at: auto
    created_at: auto

    @strawberry.field
    def registration_number(self) -> str:
        return ""
