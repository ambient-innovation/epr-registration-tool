import typing

import strawberry
from strawberry.types import Info

from common.api.permissions import IsAuthenticated
from company.api.types import CompanyType
from company.models import Company


def get_company_details(info: Info) -> typing.Optional[CompanyType]:
    user = info.context.request.user
    company = Company.objects.filter(users_queryset__id=user.id).annotate_is_profile_completed().first()
    return company if company else None


@strawberry.type
class Query:
    company_details = strawberry.field(resolver=get_company_details, permission_classes=[IsAuthenticated])
