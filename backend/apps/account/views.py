from django.conf import settings
from django.http import JsonResponse
from django.middleware.csrf import get_token

from ai_kit_auth.views import LoginView as OldLoginView

from .serializers import LoginSerializer


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
