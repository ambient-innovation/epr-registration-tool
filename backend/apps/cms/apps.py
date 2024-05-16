from django.apps import AppConfig


class CmsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.cms'

    def ready(self):
        # run file to register signals
        import apps.cms.signals  # noqa
