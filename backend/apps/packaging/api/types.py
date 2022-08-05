import strawberry
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
