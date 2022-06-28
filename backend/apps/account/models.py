from django.conf import settings
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.core.validators import validate_email
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from account.managers import UserManager, UserQuerySet


class UserTitle(models.TextChoices):
    MR = 'mr', _('Mr.')
    MRS = 'mrs', _('Mrs.')


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

    is_active = models.BooleanField(
        verbose_name=_('Email confirmed'),
        default=True,
        help_text=_('Designates whether a user has confirmed his email address'),
    )
    date_joined = models.DateTimeField(verbose_name=_('date joined'), default=timezone.now)
    language_preference = models.CharField(
        verbose_name=_('Language Preference'),
        max_length=2,
        blank=True,
        default=settings.LANGUAGES[0][0],
        choices=settings.LANGUAGES,
    )
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
