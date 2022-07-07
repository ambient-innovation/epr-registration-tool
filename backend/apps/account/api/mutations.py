from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import transaction

import strawberry
from graphql import GraphQLError
from strawberry.types import Info

from account.models import LanguageChoices


def change_user_language(info: Info, language_code: strawberry.enum(LanguageChoices)) -> str:
    user = info.context.request.user
    user.language_preference = language_code

    with transaction.atomic():
        user.save()

    return 'UPDATED'


def change_user_password(info: Info, old_password: str, new_password: str) -> str:
    user = info.context.request.user

    if not user.check_password(old_password):
        raise GraphQLError('invalidCredentials')

    if old_password == new_password:
        raise GraphQLError('identicalPasswordNotAllowed')

    try:
        validate_password(new_password)
    except ValidationError as e:
        raise GraphQLError(e.error_list[0].code, original_error=e)

    user.set_password(new_password)

    with transaction.atomic():
        user.save()

    return 'UPDATED'


@strawberry.type
class AccountMutation:
    change_language: str = strawberry.field(resolver=change_user_language)
    change_password: str = strawberry.field(resolver=change_user_password)
