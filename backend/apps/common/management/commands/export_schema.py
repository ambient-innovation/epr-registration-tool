from django.core.management import BaseCommand

from strawberry.printer import print_schema

from config.schema import schema


def export_schema():
    print(print_schema(schema))


class Command(BaseCommand):
    help = 'Exports the strawberry graphql schema'

    def handle(self, *args, **options):
        export_schema()
