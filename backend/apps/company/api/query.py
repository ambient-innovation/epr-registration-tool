import typing

import strawberry
from strawberry.types import Info

from apps.common.api.permissions import IsAuthenticated
from apps.company.api.types import CompanyType
from apps.company.models import Company


def get_company_details(info: Info) -> typing.Optional[CompanyType]:
    user = info.context.request.user
    company = (
        Company.objects.filter(users_queryset__id=user.id)
        .select_related('related_contact_info')
        .annotate_is_profile_completed()
        .first()
    )
    if company:
        company.contact_info = getattr(company, 'related_contact_info', None)
        company.additional_invoice_recipient = getattr(company, 'related_additional_invoice_recipient', None)
    return company


@strawberry.type
class Query:
    company_details = strawberry.field(resolver=get_company_details, permission_classes=[IsAuthenticated])
