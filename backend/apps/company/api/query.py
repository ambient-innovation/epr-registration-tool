import strawberry

from company.api.types import SectorType


@strawberry.type
class Query:
    sectors: list[SectorType] = strawberry.django.field()
