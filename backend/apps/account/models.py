import hashlib
from urllib.parse import urljoin

from django.conf import settings
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.core.validators import validate_email
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from ai_django_core.models import CommonInfo
from rest_framework.reverse import reverse

from account.managers import UserManager, UserQuerySet
from common.utils import base64_encode


class UserTitle(models.TextChoices):
    MR = 'mr', _('Mr.')
    MRS = 'mrs', _('Mrs.')


LanguageChoices = models.TextChoices('LanguageEnum', [key for key, val in settings.LANGUAGES])


class User(AbstractBaseUser, PermissionsMixin):
    """
    An abstract base class implementing a fully featured User model with
    admin-compliant permissions.

    Email and password are required. Other fields are optional.
    """

    email = models.EmailField(verbose_name=_('Email address'), unique=True, validators=[validate_email])

    full_name = models.CharField(verbose_name=_('Full name'), max_length=150)
    # blank=True to be able to create admins without this field
    title = models.CharField(verbose_name=_('Title'), max_length=20, blank=True, choices=UserTitle.choices)
    # blank=True to be able to create admins without this field
    position = models.CharField(verbose_name=_('Position'), max_length=255, blank=True)
    # blank=True to be able to create admins without this field
    phone_or_mobile = models.CharField(verbose_name=_('Phone/Mobile number'), max_length=16, blank=True)
    # this can be null for admin users
    related_company = models.ForeignKey(
        to='company.Company',
        verbose_name=_('Company'),
        on_delete=models.CASCADE,
        related_name='users_queryset',
        null=True,
        blank=True,
    )
    language_preference = models.CharField(
        verbose_name=_('Language Preference'),
        max_length=2,
        blank=True,
        default=LanguageChoices.en.value,
        choices=LanguageChoices.choices,
        help_text=_('Preferred language for email correspondence.'),
    )

    date_joined = models.DateTimeField(verbose_name=_('date joined'), default=timezone.now)
    has_email_confirmed = models.BooleanField(
        verbose_name=_('Email confirmed'),
        default=True,
        help_text=_('Designates whether a user has confirmed his email address'),
    )
    is_active = models.BooleanField(
        verbose_name=_('Active'),
        default=True,
        help_text=_(
            'Designates whether a user account is active or not.<br> Use this flag to deactivate/block a user account'
        ),
    )

    @property
    def can_authenticate(self):
        return self.is_active and self.has_email_confirmed

    objects = UserManager.from_queryset(UserQuerySet)()

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def __str__(self):
        return self.email

    def clean(self):
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    @property
    def is_staff(self):
        """
        Designates whether the user can log into this admin site.
        """
        return self.is_superuser

    @property
    def display_name(self):
        title = self.get_title_display()
        name = self.full_name
        if not name:
            if self.is_staff:
                name = "Admin"
            else:
                name = "Anonymous 🥷"
        return f'{title} {name}' if title else name


class NotificationSettings(models.Model):
    class Meta:
        verbose_name = _('Notification setting')
        verbose_name_plural = _('Notification settings')

    related_user = models.OneToOneField(
        'account.User',
        verbose_name=_("User"),
        primary_key=True,
        on_delete=models.CASCADE,
        related_name='notification_settings',
    )

    company_registration = models.BooleanField(
        verbose_name=_('Company registration'),
        help_text=_('Receive notifications to review a newly registered company account'),
        default=True,
    )

    def __str__(self):
        return f'Notification settings for user ID={self.related_user_id}'


class EmailChangeRequest(CommonInfo):
    class Meta:
        verbose_name = _('Email Change Request')
        verbose_name_plural = _('Email Change Requests')

    # in case a user hits a wrong email and this email is a valid another user email
    email = models.EmailField(verbose_name=_('Email address'), unique=False, validators=[validate_email])
    related_user = models.OneToOneField(
        'account.User',
        verbose_name=_("User"),
        primary_key=True,
        on_delete=models.CASCADE,
        related_name='email_change_request',
    )

    def get_change_email_token(self):
        # include the new email
        new_email = self.email.encode('utf-8')
        username = self.related_user.USERNAME_FIELD.encode('utf-8')
        secret = settings.SECRET_KEY.encode('utf-8')
        context = 'change_email'.encode()
        return hashlib.md5(context + username + new_email + secret).hexdigest()

    @property
    def is_valid(self):
        now = timezone.now()
        email_change_request_datetime = self.created_at
        delta = now - email_change_request_datetime
        # the change request is valid only within 24 hours
        return (delta.total_seconds() / (60 * 60)) <= 24

    def get_change_email_link(self):
        user = self.related_user
        user_email_encoded = base64_encode(user.email)
        path = "{url}?_t={token}".format(
            url=reverse('auth_api:change_email', args=[user_email_encoded]), token=self.get_change_email_token()
        )
        return urljoin(settings.BASE_URL, path)
