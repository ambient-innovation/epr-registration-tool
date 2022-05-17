from django.core.validators import EmailValidator
from django.db import models
from django.utils.translation import gettext_lazy as _

from ai_django_core.models import CreatedAtInfo

# Create your models here.
from company.validators import validate_street_contains_number, validate_zip_code


class Sector(models.Model):
    class Meta:
        verbose_name = _('Sector')
        verbose_name_plural = _('Sectors')

    name = models.CharField(_('Name'), max_length=150, blank=True, unique=True)

    def __str__(self):
        return self.name


class Subsector(models.Model):
    class Meta:
        verbose_name = _('Subsector')
        verbose_name_plural = _('Subsectors')

    name = models.CharField(verbose_name=_('Name'), max_length=150, blank=True, unique=True)
    related_sector = models.ForeignKey(
        verbose_name=_('Sector'), to=Sector, on_delete=models.CASCADE, related_name='subsectors_queryset'
    )

    def __str__(self):
        return self.name


class Company(CreatedAtInfo):
    class Meta:
        verbose_name = _('Company')
        verbose_name_plural = _('Companies')

    name = models.CharField(verbose_name=_('Name'), max_length=255)
    email = models.EmailField(verbose_name=_('Email address'), unique=True, validators=[EmailValidator])
    registration_number = models.CharField(verbose_name=_('Registration Number'), max_length=20, unique=True)
    street_and_house_number = models.CharField(
        verbose_name=_('Street and House Number'),
        max_length=255,
        validators=[validate_street_contains_number],
    )
    zip_code = models.CharField(_('Postal Code'), max_length=255, validators=[validate_zip_code])
    city = models.CharField(verbose_name=_('City'), max_length=255)
    province = models.CharField(verbose_name=_('Province'), max_length=255)
    country = models.CharField(verbose_name=_('Country'), max_length=255)
    additional_address_info = models.CharField(
        verbose_name=_('Additional Adress Information'), max_length=255, blank=True
    )
    phone = models.CharField(verbose_name=_('Phone number'), max_length=16, blank=True)
    mobile = models.CharField(verbose_name=_('Mobile numer'), max_length=16, blank=True)
    fax = models.CharField(verbose_name=_('Fax number'), max_length=16, blank=True)
    related_sector = models.ForeignKey(
        verbose_name=_('Sector'), to='company.Sector', on_delete=models.PROTECT, related_name='companies_queryset'
    )
    related_subsector = models.ForeignKey(
        verbose_name=_('Subsector'), to='company.Subsector', on_delete=models.PROTECT, related_name='companies_queryset'
    )

    def __str__(self):
        return self.name
