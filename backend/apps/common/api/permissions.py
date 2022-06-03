import typing

from strawberry import BasePermission
from strawberry.types import Info


class IsAuthenticated(BasePermission):
    message = "not_authenticated"

    def has_permission(self, source: typing.Any, info: Info, **kwargs) -> bool:
        return info.context.request.user.is_authenticated
