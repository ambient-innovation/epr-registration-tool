import typing

from strawberry import BasePermission
from strawberry.types import Info

from apps.company.models import Company


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


class IsCompanyProfileCompletedAndActive(BasePermission):
    not_completed_message = "companyDataNotCompleted"
    inactive_message = "noCompanyAssignedORInactiveCompany"
    message = ''

    def has_permission(self, source: typing.Any, info: Info, **kwargs) -> bool:
        current_user = info.context.request.user
        company = Company.objects.filter(pk=current_user.related_company_id).annotate_is_profile_completed().first()
        if not company or not company.is_active:
            self.message = self.inactive_message
            return False
        elif not company.is_profile_completed:
            self.message = self.not_completed_message
            return False

        return True
