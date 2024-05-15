import strawberry
from strawberry import auto

from apps.packaging.models import Material, PackagingGroup


@strawberry.django.type(PackagingGroup)
class PackagingGroupType:
    id: auto
    name: auto


@strawberry.django.type(Material)
class MaterialType:
    id: auto
    name: auto
