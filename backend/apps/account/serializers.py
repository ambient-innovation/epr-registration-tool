from django.contrib.auth import authenticate
from django.contrib.auth.backends import UserModel
from django.db.models import EmailField

from ai_kit_auth.serializers import LoginSerializer as OldLoginSerializer
from ai_kit_auth.serializers import raise_validation
from ai_kit_auth.settings import api_settings
from rest_framework import serializers


class LoginSerializer(OldLoginSerializer):
    """
    Replaces the validate function of the :py:class:`ai_kit_auth.serializers.LoginSerializer`
    because we need remember_me flag to set custom session expiration date

    Raises:
        serializers.ValidationError: If no email or password was provided or the authentication for the provided
            credentials was unsuccessful.

    Returns:
        User: the authenticated user
    """

    rememberMe = serializers.BooleanField(default=False)  # noqa

    def validate(self, attrs):
        # overwritten to return camelcase error, as we use in ours APIs only camelcase
        ident = attrs.get("ident")
        password = attrs.get("password")
        # find a unique identity
        for field_name in api_settings.USER_IDENTITY_FIELDS:
            field = UserModel._meta.get_field(field_name)
            filter_key = field.name
            if isinstance(field, EmailField):
                filter_key += "__iexact"
            try:
                ident = UserModel.objects.get(**{filter_key: ident}).get_username()
            except (UserModel.DoesNotExist, UserModel.MultipleObjectsReturned):
                continue
            break

        user = authenticate(self.context["request"], username=ident, password=password)

        if not user:
            raise_validation("invalidCredentials")

        attrs["user"] = user
        return attrs
