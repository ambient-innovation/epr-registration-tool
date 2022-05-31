from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'packaging'

    def ready(self):
        import sys

        if 'runserver' in sys.argv:
            from packaging.price_service import PriceService

            # initialize price service
            price_service = PriceService.get_instance()
            print("Initializing PriceService ... ", end='')
            price_service.initialize()
            print("🚀 done!")
