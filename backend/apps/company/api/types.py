import strawberry
from strawberry.django import auto

from company.models import Company


@strawberry.django.type(Company)
class CompanyType:
    id: auto
    name: auto
