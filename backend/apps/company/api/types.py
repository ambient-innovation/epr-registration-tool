from django.db.models import Prefetch

import strawberry
from strawberry.django import auto

from company.models import Company, Sector, Subsector


@strawberry.django.type(Company)
class CompanyType:
    id: auto
    name: auto
    registration_number: auto
    street_and_house_number: auto
    zip_code: auto
    city: auto
    province: auto
    country: auto
    additional_address_info: auto
    phone: auto
    mobile: auto
    fax: auto
    subsector: Subsector


@strawberry.django.type(Subsector)
class SubsectorType:
    id: auto
    name: auto


@strawberry.django.type(Sector)
class SectorType:
    id: auto
    name: auto
    subsectors: list[SubsectorType]

    def get_queryset(self, queryset, info):
        return queryset.prefetch_related(Prefetch('subsectors_queryset', to_attr='subsectors'))
