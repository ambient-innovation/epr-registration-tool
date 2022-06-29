from django.contrib import admin, messages
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group
from django.db.models import F
from django.utils.translation import gettext_lazy as _

from account.email import send_user_activation_notification
from account.models import NotificationSettings, User

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
    actions = ('send_activation_notification',)
    fieldsets = (
        (
            None,
            {
                'fields': (
                    'email',
                    'related_company',
                )
            },
        ),
        (
            _('Profile'),
            {
                'fields': (
                    'title',
                    'full_name',
                    'position',
                    'phone_or_mobile',
                    'language_preference',
                )
            },
        ),
        (
            _('Auth'),
            {
                'fields': (
                    'is_superuser',
                    'is_active',
                    'last_login',
                    'date_joined',
                    'password',
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
        return form

    @admin.action(description='(Re-)send email confirmation link')
    def send_activation_notification(self, request, queryset):
        inactive_selected_users = list(queryset.filter(is_active=False))
        inactive_selected_users_count = len(inactive_selected_users)
        if inactive_selected_users_count > 10:
            self.message_user(request, _('You cannot do this for more than 10 users'), messages.WARNING)
        elif inactive_selected_users_count == 0:
            self.message_user(request, _('All selected users are already active'), messages.WARNING)
        else:
            for user in inactive_selected_users:
                send_user_activation_notification(user)
            self.message_user(
                request,
                _('Send email confirmation link to %(count)s user(s) ✉️') % {'count': inactive_selected_users_count},
                messages.SUCCESS,
            )


@admin.register(NotificationSettings)
class NotificationSettingsAdmin(admin.ModelAdmin):
    list_display = (
        'user_email',
        'company_registration',
    )

    @admin.display(description='User', ordering='user_name')
    def user_email(self, obj):
        return obj.user_email

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.annotate(user_email=F('related_user__email'))
