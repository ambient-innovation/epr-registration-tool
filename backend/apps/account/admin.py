from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group
from django.utils.translation import gettext_lazy as _

from account.models import User

admin.site.unregister(Group)


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    ordering = ('email',)
    list_display = (
        'email',
        'full_name',
        'is_active',
    )
    list_filter = (
        'is_active',
        'is_superuser',
        'is_staff',
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
                    'first_name',
                    'last_name',
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
    search_fields = ['email', 'first_name', 'last_name']
