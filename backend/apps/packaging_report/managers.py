from django.db.models import F, QuerySet

from apps.account.models import User


class PackagingReportQuerySet(QuerySet):
    def visible_for(self, user: User):
        if not user or not user.is_active or not user.related_company_id:
            return self.none()

        return self.filter(related_company_id=user.related_company_id)

    def annotate_end_month(self):
        return self.annotate(end_month=F('start_month') + F('timeframe') - 1)
