from collections import OrderedDict

from django.conf import settings
from django.contrib.admin import AdminSite
from django.contrib.admin.apps import AdminConfig


class CustomAdminConfig(AdminConfig):
    default_site = 'config.admin.CustomAdminSite'


ADMIN_ORDERING = OrderedDict(
    (
        ('account', ()),
        ('company', ()),
        ('packaging_report', ('PackagingReport',)),
        ('packaging', ()),
        ('axes', ()),
    )
)
APP_ORDERING = list(ADMIN_ORDERING.keys())


class CustomAdminSite(AdminSite):
    site_header = "EPR Registration Tool"
    site_title = "EPR Registration Tool"

    site_url = settings.FRONTEND_URL

    def get_app_list(self, request):
        """
        Return a sorted list of all the installed apps that have been
        registered in this site.
        """

        def map_entry(entry, models_ordering: [str]):
            model_list = entry['models']
            entry['models'] = sorted(
                model_list,
                key=lambda x: models_ordering.index(x['object_name']) if x['object_name'] in models_ordering else 999,
            )
            return entry

        app_dict = self._build_app_dict(request)
        sorted_app_labels = sorted(app_dict.keys(), key=lambda x: APP_ORDERING.index(x) if x in APP_ORDERING else 999)
        sorted_app_dict = [
            map_entry(app_dict[key], ADMIN_ORDERING[key]) if key in APP_ORDERING else app_dict[key]
            for key in sorted_app_labels
        ]

        return sorted_app_dict
