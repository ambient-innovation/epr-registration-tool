"""
    PR-Tool URL Configuration
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, reverse_lazy
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import RedirectView

from ai_kit_auth import views as ai_kit_views
from strawberry.django.views import GraphQLView

from account import views

from .schema import schema

auth_patterns = (
    [
        path('login/', views.RememberMeLoginView.as_view(), name='login'),
        path('logout/', ai_kit_views.LogoutView.as_view(), name='logout'),
        path('activate_email/', views.ActivateUser.as_view(), name='activate'),
        path('reset_password/', ai_kit_views.ResetPassword.as_view(), name='reset_password'),
        path('send_pw_reset_email/', ai_kit_views.InitiatePasswordResetView.as_view(), name='reset_password'),
    ],
    'ai_kit_auth',
)

graphql_view = GraphQLView.as_view(schema=schema)

urlpatterns = [
    path('', RedirectView.as_view(url=reverse_lazy('admin:index'))),
    path('admin/', admin.site.urls),
    path('csrf/', views.fetch_csrf),
    path('graphql/', csrf_exempt(graphql_view) if settings.GRAPHQL_CSRF_EXEMPT else graphql_view),
    path('api/v1/auth/', include(auth_patterns)),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.ENABLE_DEBUG_TOOLBAR:
    import debug_toolbar

    urlpatterns.append(
        path('__debug__/', include(debug_toolbar.urls)),
    )
