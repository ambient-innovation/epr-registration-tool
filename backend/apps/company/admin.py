from django.contrib import admin, messages
from django.db.models import OuterRef, Subquery
from django.utils.safestring import mark_safe
from django.utils.translation import gettext_lazy as _

from ai_django_core.admin.model_admins.mixins import CommonInfoAdminMixin
from sentry_sdk import capture_exception

from account.models import User
from company.email import send_user_registration_complete_notification
from company.models import Company, CompanyContactInfo


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


class CompanyContactInfoInline(admin.StackedInline):
    model = CompanyContactInfo
    extra = 0
    fields = (
        'country',
        'postal_code',
        'city',
        'street',
        'street_number',
        'phone_number',
        'additional_address_info',
    )


@admin.register(Company)
class CompanyAdmin(CommonInfoAdminMixin, admin.ModelAdmin):
    change_form_template = 'company/change_view.html'
    inlines = (
        CompanyUserInline,
        CompanyContactInfoInline,
    )
    list_display = (
        'name',
        'contact_person_email',
        'is_active',
        'is_profile_completed',
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
                    'identification_number',
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
            .select_related('related_contact_info')
            .annotate(
                contact_person_email=(
                    Subquery(User.objects.filter(related_company_id=OuterRef('pk')).values('email')[:1])
                )
            )
            .annotate_is_profile_completed()
        )

    @admin.display(description='Contact person', ordering='contact_person_email')
    def contact_person_email(self, obj):
        return obj.contact_person_email

    @admin.display(description='Profile completed', boolean=True)
    def is_profile_completed(self, obj):
        return obj.is_profile_completed

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
