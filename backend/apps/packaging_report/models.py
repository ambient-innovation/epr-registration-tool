import decimal
import typing
from zoneinfo import ZoneInfoNotFoundError

from django.contrib import admin
from django.contrib.postgres.fields import ArrayField
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import UniqueConstraint
from django.utils.translation import gettext_lazy as _

from ai_django_core.models import CommonInfo

from common.models import Month
from common.validators import validate_greater_than_zero
from packaging_report.managers import PackagingReportQuerySet


def validate_report_month(value):
    if value <= 0 or value > 12:
        raise ValidationError(_('%(value)s invalid month'), params={'value': value}, code='invalidMonth')


def validate_report_timezone(value):
    import zoneinfo

    try:
        zoneinfo.ZoneInfo(key=value)
    except ZoneInfoNotFoundError:
        raise ValidationError(_('%(value)s invalid timezone'), params={'value': value}, code="zoneInfoNotFound")


class TimeframeType(models.IntegerChoices):
    MONTH = 1, _("1 month")
    THREE_MONTHS = 3, _("3 months")
    TWELVE_MONTHS = 12, _("12 months")


class ReportSubmission(CommonInfo):
    class Meta:
        verbose_name = _("Report Submission")
        verbose_name_plural = _("Report Submissions")
        abstract = True


class PackagingReport(CommonInfo):
    class Meta:
        verbose_name = _("Packaging Report")
        verbose_name_plural = _("Packaging Reports")

    related_company = models.ForeignKey(
        'company.Company',
        verbose_name=_('Company'),
        related_name="packaging_report_queryset",
        on_delete=models.CASCADE,
    )

    timeframe = models.PositiveIntegerField(
        verbose_name=_("Timeframe"),
        choices=TimeframeType.choices,
    )
    year = models.PositiveIntegerField(verbose_name=_('Year'))
    start_month = models.PositiveIntegerField(
        verbose_name=_('Start Month'), validators=[validate_report_month], choices=Month.choices
    )
    timezone_info = models.CharField(
        verbose_name=_('Timezone info'), max_length=32, validators=[validate_report_timezone]
    )

    objects = PackagingReportQuerySet.as_manager()

    def clean(self):
        if self.start_month + (self.timeframe - 1) > 12:
            raise ValidationError({"timeframe": _('report has to start and end in same year')}, code="invalidTimeframe")

        super().clean()

    def __str__(self):
        return f'Packaging Report ({self.id}): {self.timeframe} months from {self.start_month}.{self.year}'


class ForecastSubmission(ReportSubmission):
    class Meta:
        verbose_name = _("Forecast Submission")
        verbose_name_plural = _("Forecast Submissions")

    related_report = models.OneToOneField(
        PackagingReport,
        verbose_name=_('Packaging Report'),
        related_name='related_forecast',
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return f'Forecast Report ({self.id})'

    @admin.display(description="Estimated Fees")
    def estimated_fees(self) -> typing.Optional[decimal.Decimal]:
        from packaging.price_utils import calculate_material_fees

        fees = 0
        timeframe = self.related_report.timeframe
        start_month = self.related_report.start_month
        year = self.related_report.year
        for m in self.material_records_queryset.all():
            fees = fees + calculate_material_fees(
                timeframe, year, start_month, m.related_packaging_material_id, m.quantity
            )

        return f'{round(fees, 2)} JOD/ {timeframe} month(s)'


class MaterialRecord(CommonInfo):
    related_submission = models.ForeignKey(
        ForecastSubmission,
        verbose_name=_('Submission'),
        related_name="material_records_queryset",
        on_delete=models.CASCADE,
    )
    related_packaging_group = models.ForeignKey(
        'packaging.PackagingGroup',
        verbose_name=_('Packaging Group'),
        related_name="material_records_queryset",
        on_delete=models.PROTECT,
    )
    related_packaging_material = models.ForeignKey(
        'packaging.Material',
        verbose_name=_('Material'),
        related_name="material_records_queryset",
        on_delete=models.PROTECT,
    )
    quantity = models.FloatField(verbose_name=_('Quantity (Kg)'), validators=[validate_greater_than_zero])
    # - this will be the complete quantity divided on the selected timeframe
    # - quantity in month  can be different from month to month in case the quantity changed in the forecast
    #   timeframe (between start and end date)
    # E.g: if timeframe is 3 months and quantity is 9 this will be [3, 3, 3]
    monthly_quantities = ArrayField(
        models.FloatField(verbose_name=_('Quantity per month')),
        verbose_name=_('Monthly Quantities'),
        size=12,
        default=list,
    )

    class Meta:
        verbose_name = _("Material record")
        verbose_name_plural = _("Material records")
        constraints = (
            (
                UniqueConstraint(
                    fields=['related_packaging_group', 'related_packaging_material', 'related_submission'],
                    name='unique_material_record_in_report_submission',
                )
            ),
        )
