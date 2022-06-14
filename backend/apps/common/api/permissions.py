import typing

from strawberry import BasePermission
from strawberry.types import Info


class IsAuthenticated(BasePermission):
    message = "not_authenticated"

    def has_permission(self, source: typing.Any, info: Info, **kwargs) -> bool:
        return info.context.request.user.is_authenticated


class IsActivated(BasePermission):
    message = "noCompanyAssignedORInactiveCompany"

    def has_permission(self, source: typing.Any, info: Info, **kwargs) -> bool:
        current_user = info.context.request.user
        related_company = current_user.related_company
        return related_company and related_company.is_active
