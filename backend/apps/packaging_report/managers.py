from django.db.models import QuerySet

from account.models import User


class PackagingReportQuerySet(QuerySet):
    def visible_for(self, user: User):
        if not user or not user.is_active or not user.related_company_id:
            return self.none()

        return self.filter(related_company_id=user.related_company_id)
