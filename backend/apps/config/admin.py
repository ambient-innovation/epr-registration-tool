from django.conf import settings
from django.contrib.admin import AdminSite
from django.contrib.admin.apps import AdminConfig


class CustomAdminConfig(AdminConfig):
    default_site = 'config.admin.CustomAdminSite'


class CustomAdminSite(AdminSite):
    site_header = "EPR Registration Tool"
    site_title = "EPR Registration Tool"

    site_url = settings.FRONTEND_URL
