from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.core.validators import validate_email
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from account.managers import UserManager


class UserTitle(models.TextChoices):
    MR = 'mr', _('Mr.')
    MRS = 'ms', _('Ms')


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
        verbose_name=_('active'),
        default=True,
        help_text=_(
            'Designates whether this user should be treated as active. ' 'Unselect this instead of deleting accounts.'
        ),
    )
    date_joined = models.DateTimeField(verbose_name=_('date joined'), default=timezone.now)

    objects = UserManager()

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
