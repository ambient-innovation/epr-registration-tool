from django.contrib.auth import authenticate
from django.contrib.auth.backends import UserModel

from ai_kit_auth.serializers import LoginSerializer as OldLoginSerializer
from ai_kit_auth.serializers import raise_validation
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
        email = attrs.get("ident")
        password = attrs.get("password")
        request = self.context["request"]

        if request.user.is_authenticated:
            raise_validation('alreadyAuthenticated')

        # query user to provide more detailed error messages
        user = UserModel.objects.filter(email=email).first()

        if not user:
            raise_validation("invalidCredentials")

        if not user.is_active:
            raise_validation("inactiveUser")

        if not user.check_password(password):
            raise_validation("invalidCredentials")

        if not user.has_email_confirmed:
            raise_validation("emailNotConfirmed")

        if not user.is_staff:
            company_id = user.related_company_id
            if not company_id:
                raise_validation("missingCompanyRelation")

            from apps.company.models import Company

            if not Company.objects.filter(id=company_id, is_active=True).exists():
                raise_validation("inactiveCompany")

        authenticated_user = authenticate(request, username=email, password=password)

        if authenticated_user is None:
            raise_validation("unknownLoginError")

        attrs["user"] = authenticated_user
        return attrs
