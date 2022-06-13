from django.db.models import BooleanField, ExpressionWrapper, Q, QuerySet


class CompanyQuerySet(QuerySet):
    def annotate_is_profile_completed(self):
        return self.annotate(
            is_profile_completed=ExpressionWrapper(
                Q(related_contact_info__isnull=False) & ~Q(identification_number=""), output_field=BooleanField()
            )
        )
