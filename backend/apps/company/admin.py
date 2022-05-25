from django.contrib import admin
from django.db.models import OuterRef, Subquery
from django.utils.translation import gettext_lazy as _

from modeltranslation.admin import TranslationAdmin, TranslationStackedInline

from account.models import User
from company.models import Company, Sector, Subsector


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


class SubsectorInline(TranslationStackedInline):
    model = Subsector
    extra = 0


@admin.register(Sector)
class SectorAdmin(TranslationAdmin):
    inlines = (SubsectorInline,)
    fields = ('name',)


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    inlines = (CompanyUserInline,)
    list_display = (
        'name',
        'contact_person_email',
    )
    list_filter = (
        'city',
        'related_subsector',
    )
    search_fields = (
        'name',
        'email',
        'registration_number',
        'related_subsector',
    )
    fieldsets = (
        (
            _('General Information'),
            {'fields': ('name',)},
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
