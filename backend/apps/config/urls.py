"""
    PR-Tool URL Configuration
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path, reverse_lazy
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import RedirectView

from ai_kit_auth import views as ai_kit_views
from strawberry.django.views import GraphQLView
from wagtail.admin import urls as wagtailadmin_urls
from wagtail.documents import urls as wagtaildocs_urls
from wagtail.urls import serve_pattern
from wagtail.views import serve

from apps.account import views
from apps.account.views import ConfirmUserEmailChangeView
from apps.cms.api.router import api_router
from apps.cms.headless_mixin import CustomHeadlessMixin
from apps.config.schema import schema

auth_patterns = (
    [
        path('login/', views.RememberMeLoginView.as_view(), name='login'),
        path('logout/', ai_kit_views.LogoutView.as_view(), name='logout'),
        path('activate_email/', views.ActivateUser.as_view(), name='activate'),
        path('reset_password/', ai_kit_views.ResetPassword.as_view(), name='reset_password'),
        path('send_pw_reset_email/', ai_kit_views.InitiatePasswordResetView.as_view(), name='reset_password'),
        path('users/<str:user_ident>/change_email_confirm/', ConfirmUserEmailChangeView.as_view(), name='change_email'),
    ],
    'auth_api',
)

graphql_view = GraphQLView.as_view(schema=schema)

urlpatterns = [
    path('', RedirectView.as_view(url=reverse_lazy('admin:index'))),
    path('admin/', admin.site.urls),
    path('csrf/', views.fetch_csrf),
    path('graphql/', csrf_exempt(graphql_view) if settings.GRAPHQL_CSRF_EXEMPT else graphql_view),
    path('api/v1/auth/', include(auth_patterns)),
    # --- wagtail ---
    # custom serve URL, that does not start at root level
    # Otherwise the root page would lead to our backend root URL (which is a redirect to django admin)
    re_path(rf'^{CustomHeadlessMixin.SERVE_PATH}/{serve_pattern[1:]}', serve, name="wagtail_serve"),
    # override wagtail login --> use django admin login instead
    path('cms/login/', RedirectView.as_view(url=reverse_lazy('admin:login'), query_string=True)),
    path('cms/api/v2/', api_router.urls),
    path('cms/', include(wagtailadmin_urls)),
    path('documents/', include(wagtaildocs_urls)),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.ENABLE_DEBUG_TOOLBAR:
    import debug_toolbar

    urlpatterns.append(
        path('__debug__/', include(debug_toolbar.urls)),
    )
