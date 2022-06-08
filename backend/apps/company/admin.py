from django.contrib import admin, messages
from django.db.models import OuterRef, Subquery
from django.utils.safestring import mark_safe
from django.utils.translation import gettext_lazy as _

from sentry_sdk import capture_exception

from account.models import User
from company.email import send_user_registration_complete_notification
from company.models import Company


class CompanyUserInline(admin.StackedInline):
    model = User
    extra = 0
    max_num = 0  # prevent creating users inline
    fields = (
        'is_active',
        'email',
        'title',
        'full_name',
        'position',
        'phone_or_mobile',
    )
    readonly_fields = (
        'email',
        'is_active',
    )


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    change_form_template = 'company/change_view.html'
    inlines = (CompanyUserInline,)
    list_display = (
        'name',
        'contact_person_email',
        'is_active',
    )
    list_filter = ('is_active',)
    search_fields = ('name',)
    fieldsets = (
        (
            None,
            {'fields': ('is_active',)},
        ),
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

    def get_readonly_fields(self, request, obj=None):
        readonly_fields = super().get_readonly_fields(request, obj=obj)
        if obj and obj.is_active:
            return readonly_fields + ('is_active',)
        return readonly_fields

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

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)

        # notify user when is_active is changed from False -> True
        if change is True and 'is_active' in form.changed_data and obj.is_active:
            try:
                send_user_registration_complete_notification(obj)
                self.message_user(
                    request,
                    mark_safe(
                        _(
                            'The company account is activated now 🚀. <br> '
                            'The company\'s contact person(s) have been notified ✉️.'
                        )
                    ),
                    messages.SUCCESS,
                )
            except Exception as e:
                # failing emails should not break anything else
                capture_exception(e)
