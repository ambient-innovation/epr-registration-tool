import os
import uuid

from django.db import models
from django.utils.translation import gettext_lazy as _

from ai_django_core.models import CommonInfo

from common.storage_backend import private_file_storage
from company.managers import CompanyQuerySet
from company.validators import validate_allowed_image_formats, validate_max_image_size


class DistributorType(models.TextChoices):
    IMPORTER = 'IMPORTER', _('Importer')
    LOCAL_PRODUCER = 'LOCAL_PRODUCER', _('Local producer')


class Company(CommonInfo):
    class Meta:
        verbose_name = _('Company')
        verbose_name_plural = _('Companies')

    objects = CompanyQuerySet.as_manager()

    name = models.CharField(verbose_name=_('Name'), max_length=255)
    distributor_type = models.CharField(
        verbose_name=_('Distributor Type'),
        max_length=20,
        choices=DistributorType.choices,
    )
    is_active = models.BooleanField(
        verbose_name=_("Active"),
        default=False,
        blank=True,
        help_text=_('No user of the company will be able to log in as long the company is inactive.'),
    )
    identification_number = models.CharField(
        verbose_name=_('National identification number'), blank=True, max_length=255
    )
    logo = models.ImageField(
        _('Logo'),
        upload_to='logos',
        storage=private_file_storage,
        validators=[
            validate_max_image_size,
            validate_allowed_image_formats,
        ],
        max_length=255,
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.name

    def update_logo(self, image):
        self.logo = image
        file_name, file_extension = os.path.splitext(image.name)
        file_name = str(uuid.uuid4())
        self.logo.name = f'{file_name}{file_extension}'


class CompanyContactInfo(CommonInfo):
    class Meta:
        verbose_name = _('Company Contact Info')
        verbose_name_plural = _('Company Contact Infos')

    related_company = models.OneToOneField(
        Company, related_name='related_contact_info', on_delete=models.CASCADE, primary_key=True
    )

    country = models.CharField(verbose_name=_('Country'), max_length=100)
    postal_code = models.CharField(verbose_name=_('Postal code'), blank=True, max_length=15)
    city = models.CharField(verbose_name=_('City'), max_length=255)
    street = models.CharField(verbose_name=_('Street'), max_length=255)
    street_number = models.CharField(verbose_name=_('Street number'), blank=True, max_length=15)
    phone_number = models.CharField(verbose_name=_('Phone number'), max_length=20)
    additional_address_info = models.TextField(verbose_name=_('Additional address info'), blank=True)

    @property
    def address_line(self):
        return ", ".join(
            list(
                filter(
                    None,
                    [
                        self.street,
                        self.street_number,
                        self.city,
                        self.postal_code,
                        self.country,
                        self.additional_address_info,
                    ],
                )
            )
        )
