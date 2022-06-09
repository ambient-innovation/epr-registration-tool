from django.conf import settings
from django.contrib.auth import get_user_model, tokens
from django.http import JsonResponse
from django.middleware.csrf import get_token

from ai_kit_auth import services
from ai_kit_auth.views import ActivateUser as OldActivateUser
from ai_kit_auth.views import LoginView as OldLoginView
from rest_framework import status
from rest_framework.response import Response
from sentry_sdk import capture_exception

from .serializers import LoginSerializer

UserModel = get_user_model()


def fetch_csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})


def csrf_failure(request, reason=""):
    """
    Replacement for the default Django view csrf_failure.
    We want to return json instead of html since all our APIs are json based.
    """
    return JsonResponse({'error': 'csrf_failure'}, status=403)


class RememberMeLoginView(OldLoginView):
    """
    Replaces the :py:class:`ai_kit_auth.serializers.LoginSerializer` with our
    :py:class:`apps.config.serializers.LoginSerializer` due to a missing remember_me.
    """

    serializer_class = LoginSerializer
    default_session_expire_age = settings.SESSION_COOKIE_AGE

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=self.request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        remember_me = serializer.validated_data["rememberMe"]

        response = super().post(request, *args, **kwargs)
        if remember_me is True:
            request.session.set_expiry(self.default_session_expire_age)
        return response


class ActivateUser(OldActivateUser):
    """
    Slightly adjusted version of ai_kit_auth.views.ActivateUser
    - only save user when user is not yet active
    - notify admins to confirm user
    """

    def post(self, request, *args, **kwargs):
        try:
            ident = request.data["ident"]
            token = request.data["token"]
            pk = services.scramble_id(ident)
            user = UserModel.objects.get(pk=pk)
            if not tokens.PasswordResetTokenGenerator().check_token(user, token):
                raise ValueError
        except (
            KeyError,
            TypeError,
            ValueError,
            OverflowError,
            UserModel.DoesNotExist,
        ):
            return Response(
                {"error": "activationLinkInvalid"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not user.is_active:
            user.is_active = True
            user.save()

            # notify admins about newly registered company
            company = user.related_company
            if company and not company.is_active:
                from company.email import send_admin_registration_notification

                try:
                    send_admin_registration_notification(company_id=company.id)
                except Exception as e:
                    # failing email should not break the user activation
                    capture_exception(e)

        return Response(status=status.HTTP_200_OK)
