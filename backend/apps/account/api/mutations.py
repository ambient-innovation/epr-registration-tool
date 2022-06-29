from django.db import transaction
from django.utils.translation.trans_real import get_languages

import strawberry
from graphql import GraphQLError
from strawberry.types import Info


def change_user_language(info: Info, language_code: str) -> str:
    user = info.context.request.user
    language_code = language_code.lower()
    supported_languages = get_languages()

    if language_code not in supported_languages:
        raise GraphQLError('languageCodeNotSupported')

    user.language_preference = language_code

    with transaction.atomic():
        user.save()

    return 'UPDATED'


@strawberry.type
class AccountMutation:
    change_language: str = strawberry.field(resolver=change_user_language)
