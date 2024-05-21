from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import transaction

import strawberry
from graphql import GraphQLError
from sentry_sdk import capture_exception
from strawberry.types import Info

from apps.account.api.inputs import UserChangeInputType
from apps.account.email import send_account_data_changed_mail, send_request_email_change_confirm_mail
from apps.account.models import EmailChangeRequest, LanguageChoices


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


def change_user_account(info: Info, account_data: UserChangeInputType) -> str:
    user = info.context.request.user

    account_data_dict = {key: value and value.strip() for key, value in vars(account_data).items()}
    delete_old_change_request = False
    email_input = account_data_dict.pop('email', None)
    old_email_change_request = getattr(user, 'email_change_request', None)
    new_email_change_request = None
    if old_email_change_request and email_input == user.email:
        # the new email address requested is same as the current one, so the Change Request is outdated
        delete_old_change_request = True
    elif email_input != user.email:  # request to change the email
        # delete old request if already exists and not the same email_input
        if not old_email_change_request or (old_email_change_request and old_email_change_request.email != email_input):
            if old_email_change_request:
                delete_old_change_request = True
            new_email_change_request = EmailChangeRequest(email=email_input, related_user=user)

    # update user data always to avoid looking for changes!
    for key, value in account_data_dict.items():
        assert hasattr(user, key), f'User has no attribute {key}'
        setattr(user, key, value)

    with transaction.atomic():
        delete_old_change_request and old_email_change_request.delete()
        try:
            user.full_clean()
            new_email_change_request and new_email_change_request.full_clean()
        except ValidationError as e:
            raise GraphQLError('validationError', original_error=e)

        new_email_change_request and new_email_change_request.save()
        user.save()
        try:
            send_account_data_changed_mail(user)
            new_email_change_request and send_request_email_change_confirm_mail(user, new_email_change_request)
        except Exception as e:
            # failing emails should not break the update
            capture_exception(e)

    return 'UPDATED'


@strawberry.type
class AccountMutation:
    change_language: str = strawberry.field(resolver=change_user_language)
    change_password: str = strawberry.field(resolver=change_user_password)
    change_account: str = strawberry.field(resolver=change_user_account)
