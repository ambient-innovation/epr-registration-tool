from django.db import models
from django.db.models import UniqueConstraint
from django.utils.translation import gettext_lazy as _

from ai_django_core.models import CommonInfo

from common.models import Month


class PackagingGroup(CommonInfo):
    name = models.CharField(verbose_name=_('Name'), max_length=255)

    def __str__(self):
        return self.name


class Material(CommonInfo):
    name = models.CharField(verbose_name=_('Name'), max_length=255)

    def __str__(self):
        return self.name


class MaterialPrice(CommonInfo):
    start_year = models.PositiveIntegerField(
        verbose_name=_("Year"),
        db_index=True,
    )
    start_month = models.PositiveIntegerField(
        verbose_name=_("Month"),
        choices=Month.choices,
        db_index=True,
    )
    price_per_kg = models.FloatField(verbose_name=_("Price (Kg)"), help_text=_("price in JOD"))

    sort_key = models.PositiveIntegerField(verbose_name=_('Sort key'), db_index=True)

    related_material = models.ForeignKey(
        'packaging.Material',
        verbose_name=_('Material'),
        related_name="prices_queryset",
        on_delete=models.CASCADE,
    )

    @staticmethod
    def get_sort_key(year: int, month: int) -> int:
        # to be able to order and compare years and months we create an int from both
        return year * 100 + month

    def save(self, *args, **kwargs):
        self.sort_key = self.get_sort_key(self.start_year, self.start_month)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = _("Price")
        verbose_name_plural = _("Prices")
        constraints = (
            (
                UniqueConstraint(
                    fields=['related_material', 'start_year', 'start_month'],
                    name='unique_material_price',
                )
            ),
        )

    def __str__(self):
        return f'Price as of {self.start_month}.{self.start_year}'
