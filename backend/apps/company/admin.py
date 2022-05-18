from django.contrib import admin
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
    list_display = ('registration_number', 'name')
    list_filter = (
        'city',
        'related_sector',
        'related_subsector',
    )
    search_fields = (
        'name',
        'email',
        'registration_number',
        'related_sector' 'related_subsector',
    )
    fieldsets = (
        (
            _('General Information'),
            {
                'fields': (
                    'name',
                    'registration_number',
                    'related_sector',
                    'related_subsector',
                )
            },
        ),
        (
            _('Address'),
            {
                'fields': (
                    'street_and_house_number',
                    'zip_code',
                    'city',
                    'additional_address_info',
                    'province',
                    'country',
                )
            },
        ),
        (
            _('Contact Information'),
            {
                'fields': (
                    'email',
                    'phone',
                    'mobile',
                    'fax',
                )
            },
        ),
    )

    def has_change_permission(self, request, obj=None):
        return False
