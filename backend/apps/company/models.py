from django.db import models
from django.utils.translation import gettext_lazy as _

from ai_django_core.models import CommonInfo


class DistributorType(models.TextChoices):
    IMPORTER = 'IMPORTER', _('Importer')
    LOCAL_PRODUCER = 'LOCAL_PRODUCER', _('Local producer')


class Company(CommonInfo):
    class Meta:
        verbose_name = _('Company')
        verbose_name_plural = _('Companies')

    name = models.CharField(verbose_name=_('Name'), max_length=255)
    distributor_type = models.CharField(
        verbose_name=_('Distributor Type'),
        max_length=20,
        choices=DistributorType.choices,
    )

    def __str__(self):
        return self.name
