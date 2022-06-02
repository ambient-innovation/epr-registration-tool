from django.db import models
from django.db.models import UniqueConstraint
from django.utils.translation import gettext_lazy as _

from ai_django_core.models import CommonInfo


class Month(models.IntegerChoices):
    JANUARY = 1, _("January")
    FEBRUARY = 2, _("February")
    MARCH = 3, _("March")
    APRIL = 4, _("April")
    MAY = 5, _("May")
    JUNE = 6, _("June")
    JULY = 7, _("July")
    AUGUST = 8, _("August")
    SEPTEMBER = 9, _("September")
    OCTOBER = 10, _("October")
    NOVEMBER = 11, _("November")
    DECEMBER = 12, _("December")


class PackagingGroup(CommonInfo):
    name = models.CharField(verbose_name=_('Name'), max_length=255)

    def __str__(self):
        return self.name


class Material(CommonInfo):
    name = models.CharField(verbose_name=_('Name'), max_length=255)

    def __str__(self):
        return self.name


class Price(CommonInfo):
    class Meta:
        verbose_name = _("Price")
        verbose_name_plural = _("Prices")
        abstract = True

    start_year = models.PositiveIntegerField(
        verbose_name=_("Year"),
        db_index=True,
    )
    start_month = models.PositiveIntegerField(
        verbose_name=_("Month"),
        choices=Month.choices,
        db_index=True,
    )
    price_per_kg = models.PositiveIntegerField(
        verbose_name=_("Price (Kg)"),
    )

    sort_key = models.PositiveIntegerField(verbose_name=_('Sort key'), db_index=True)

    @staticmethod
    def get_sort_key(year: int, month: int) -> int:
        return year * 100 + month

    def save(self, *args, **kwargs):
        self.sort_key = self.get_sort_key(self.start_year, self.start_month)
        super().save(*args, **kwargs)


class MaterialPrice(Price):
    related_material = models.ForeignKey(
        'packaging.Material',
        verbose_name=_('Material'),
        on_delete=models.CASCADE,
    )

    class Meta(Price.Meta):
        constraints = (
            (
                UniqueConstraint(
                    fields=['related_material', 'start_year', 'start_month'],
                    name='unique_material_price',
                )
            ),
        )

    def __str__(self):
        return f'Price for material {self.related_material_id} [{self.start_month}.{self.start_year}]'
