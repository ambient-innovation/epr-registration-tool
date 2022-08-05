import typing

import strawberry
from strawberry.django import auto

from account.models import EmailChangeRequest, LanguageChoices, User


@strawberry.django.type(EmailChangeRequest)
class EmailChangeRequestType:
    email: auto
    created_at: auto

    @strawberry.django.field
    def is_valid(self, root: EmailChangeRequest) -> bool:
        # request is invalid after 24 hours
        return root.is_valid


@strawberry.django.type(User)
class UserType:
    id: auto
    email: auto
    title: auto
    full_name: auto
    phone_or_mobile: auto
    position: auto
    language_preference: strawberry.enum(LanguageChoices)

    @strawberry.django.field
    def email_change_request(self, root: User) -> typing.Optional[EmailChangeRequestType]:
        return getattr(root, 'email_change_request', None)
