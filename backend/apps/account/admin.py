from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group
from django.db.models import F
from django.utils.translation import gettext_lazy as _

from account.models import User

admin.site.unregister(Group)


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    ordering = ('email',)
    autocomplete_fields = ('related_company',)
    list_display = (
        'email',
        'full_name',
        'is_active',
        'company_name',
    )
    list_filter = (
        'is_active',
        'is_superuser',
    )
    fieldsets = (
        (
            None,
            {
                'fields': (
                    'email',
                    'password',
                    'is_superuser',
                    'is_active',
                    'last_login',
                    'date_joined',
                )
            },
        ),
        (
            _('Profile'),
            {
                'fields': (
                    'title',
                    'full_name',
                    'related_company',
                    'position',
                    'phone_or_mobile',
                )
            },
        ),
    )
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': (
                    'email',
                    'password1',
                    'password2',
                    'title',
                    'full_name',
                    'is_active',
                    'is_superuser',
                ),
            },
        ),
    )
    readonly_fields = (
        'date_joined',
        'last_login',
    )
    search_fields = ['email', 'full_name']

    @admin.display(description='Company', ordering='company_name')
    def company_name(self, obj):
        return obj.company_name

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.annotate(company_name=F('related_company__name'))

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        # remove inline action buttons of autocomplete input field
        if 'related_company' in form.base_fields:
            form.base_fields['related_company'].widget.can_add_related = False
            form.base_fields['related_company'].widget.can_delete_related = False
            form.base_fields['related_company'].widget.can_change_related = False
        return form
