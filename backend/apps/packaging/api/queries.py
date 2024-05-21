import typing

import strawberry
from strawberry.types import Info

from apps.packaging.api.types import MaterialType, PackagingGroupType


@strawberry.type
class PackagingQuery:
    @strawberry.field()
    def packaging_groups(self, info: Info) -> typing.List[PackagingGroupType]:
        from apps.packaging.models import PackagingGroup

        return PackagingGroup.objects.all()

    @strawberry.field()
    def packaging_materials(self, info: Info) -> typing.List[MaterialType]:
        from apps.packaging.models import Material

        return Material.objects.all()
