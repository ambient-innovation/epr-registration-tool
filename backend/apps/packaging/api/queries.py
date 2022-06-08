import typing

import strawberry

from packaging.api.types import MaterialType, PackagingGroupType


@strawberry.type
class PackagingQuery:
    packaging_groups: typing.List[PackagingGroupType] = strawberry.django.field()
    packaging_materials: typing.List[MaterialType] = strawberry.django.field()
