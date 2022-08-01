from urllib.parse import urljoin

from django.conf import settings
from django.contrib.auth import get_user_model, logout, tokens
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import IntegrityError
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.generic import RedirectView

from ai_kit_auth import services
from ai_kit_auth.views import ActivateUser as OldActivateUser
from ai_kit_auth.views import LoginView as OldLoginView
from rest_framework import status
from rest_framework.response import Response
from sentry_sdk import capture_exception

from common.utils import base64_decode, parse_url_with_params

from .models import EmailChangeRequest, User
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
    - only save user when user has not confirmed his email
    - use `has_email_confirmed` instead of `is_active´
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
        if not user.has_email_confirmed:
            user.has_email_confirmed = True
            user.save()

            # notify admins about newly registered company
            company = user.related_company
            if company and not company.is_active:
                from company.email import send_admin_registration_notification

                try:
                    send_admin_registration_notification(company=company)
                except Exception as e:
                    # failing email should not break the user activation
                    capture_exception(e)

        return Response(status=status.HTTP_200_OK)


class ConfirmUserEmailChangeView(RedirectView):
    """
    Proceed user email change request:
    - if the request is not older than 24 hours
    - if the token in the url is correct
    - if there is request any way
    """

    base_url = urljoin(settings.FRONTEND_URL, '/account-settings/change-email-confirm')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.success = False
        self.error_code = 'error'

    def get_redirect_url(self, *args, **kwargs):
        params = {'state': 'success' if self.success else self.error_code}
        return parse_url_with_params(self.base_url, params)

    def get(self, request, *args, **kwargs):
        try:
            user_token = request.GET.get('_t', None)
            base64_user_email = kwargs.get('user_ident', None)

            try:
                user_email = base64_decode(base64_user_email)
            except Exception as e:
                raise ValidationError(message=e.message, code='incorrectEmailEncode')

            user = User.objects.get(email=user_email)

            email_change_request: EmailChangeRequest = user.email_change_request
            change_email_token = email_change_request.get_change_email_token()

            new_email = email_change_request.email
            if not email_change_request.is_valid:
                raise ValidationError(message='email change request is not valid any more', code='requestOutdated')
            elif user_token != change_email_token:
                raise ValidationError(message=f'token ({change_email_token}) is not valid', code='invalidToken')

            if user_token == change_email_token and new_email and email_change_request.is_valid:
                user.email = new_email
                user.save()
                self.success = True
                email_change_request.delete()
                logout(request)
        except User.DoesNotExist:
            self.error_code = 'userDoesNotExists'
        except ObjectDoesNotExist:
            self.error_code = 'requestDoesNotExists'
        except ValidationError as e:
            self.error_code = e.code
            capture_exception(e)
        except IntegrityError as e:
            self.error_code = 'emailExists'
            capture_exception(e)
        except Exception as e:
            # in case of unexpected error, we need to log it.
            capture_exception(e)
        return super().get(request, *args, **kwargs)
