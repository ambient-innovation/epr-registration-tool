import decimal
import typing

import strawberry
from strawberry import ID
from strawberry.django import auto

from packaging.models import Material, PackagingGroup


@strawberry.django.type(PackagingGroup)
class PackagingGroupType:
    id: auto
    name: auto


@strawberry.django.type(Material)
class MaterialType:
    id: auto
    name: auto


@strawberry.input
class MaterialInput:
    material_id: ID
    quantity: decimal.Decimal


@strawberry.input
class PackagingGroupInput:
    packaging_group_id: ID
    material_records: typing.List[MaterialInput]
