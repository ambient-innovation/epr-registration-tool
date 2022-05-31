from django.contrib import admin
from django.db.models import OuterRef, Subquery
from django.utils.translation import gettext_lazy as _

from account.models import User
from company.models import Company


class CompanyUserInline(admin.StackedInline):
    model = User
    extra = 0
    fields = (
        'email',
        'title',
        'full_name',
        'is_active',
        'position',
        'phone_or_mobile',
    )


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    inlines = (CompanyUserInline,)
    list_display = (
        'name',
        'contact_person_email',
    )
    search_fields = ('name',)
    fieldsets = (
        (
            _('General Information'),
            {
                'fields': (
                    'name',
                    'distributor_type',
                )
            },
        ),
    )

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .annotate(
                contact_person_email=(
                    Subquery(User.objects.filter(related_company_id=OuterRef('pk')).values('email')[:1])
                )
            )
        )

    @admin.display(description='Contact person', ordering='contact_person_email')
    def contact_person_email(self, obj):
        return obj.contact_person_email

    def has_change_permission(self, request, obj=None):
        return False
