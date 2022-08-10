import datetime
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from ai_django_core.models import CommonInfo
from dateutil.relativedelta import relativedelta
from django.contrib import admin
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import UniqueConstraint
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from common.models import Month
from common.storage_backend import private_file_storage
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

    @staticmethod
    def calculate_fees(packaging_report, material_records):
        from packaging_report.utils import calculate_fees as _calculate_fees

        material_quantities = [(m.related_packaging_material_id, m.quantity) for m in material_records]

        return _calculate_fees(
            timeframe=packaging_report.timeframe,
            start_month=packaging_report.start_month,
            year=packaging_report.year,
            material_quantities=material_quantities,
        )

    def estimated_fees_str(self) -> str:
        final_fees = getattr(self, 'fees', None)
        try:
            fees = (
                final_fees
                if final_fees
                else self.calculate_fees(self.related_report, self.material_records_queryset.all())
            )
        except ValidationError:
            # possible case: first material price not available at report year
            return _('n.a. (missing material price)')
        return f'{fees} JOD/ {self.related_report.timeframe} month(s)'


class ReportTypes(models.IntegerChoices):
    FORCAST = 1, _("Forcast")
    FINAL = 2, _("Actual Quantities")

    @staticmethod
    def get_label_by_value(value):
        choices = [c[1] for c in ReportTypes.choices if c[0] == value]
        return choices[0] if len(choices) else None


class PackagingReport(CommonInfo):
    class Meta:
        verbose_name = _("Data Report")
        verbose_name_plural = _("Data Reports")

    related_company = models.ForeignKey(
        'company.Company',
        verbose_name=_('Company'),
        related_name="packaging_report_queryset",
        on_delete=models.PROTECT,
    )

    timeframe = models.PositiveIntegerField(
        verbose_name=_("Timeframe"),
        choices=TimeframeType.choices,
    )
    year = models.PositiveIntegerField(verbose_name=_('Year'), db_index=True)
    start_month = models.PositiveIntegerField(
        verbose_name=_('Start Month'),
        validators=[validate_report_month],
        choices=Month.choices,
        db_index=True,
    )
    timezone_info = models.CharField(
        verbose_name=_('Timezone info'), max_length=32, validators=[validate_report_timezone]
    )
    invoice_file = models.FileField(
        _('Invoice File'),
        upload_to='invoices',
        storage=private_file_storage,
        max_length=255,
        null=True,
        blank=True,
    )

    objects = PackagingReportQuerySet.as_manager()

    def clean(self):
        if self.start_month + (self.timeframe - 1) > 12:
            raise ValidationError({"timeframe": _('report has to start and end in same year')}, code="invalidTimeframe")

        super().clean()

    @property
    def end_datetime(self):
        # the last moment in the timeframe
        return (
            timezone.make_aware(
                datetime.datetime(
                    year=self.year,
                    month=self.start_month,
                    day=1,
                ),
                ZoneInfo(self.timezone_info),
            )
            + relativedelta(months=self.timeframe, microseconds=-1)
            if self.year and self.start_month
            else None
        )

    @admin.display(description="End date time")
    def end_datetime_display(self):
        end_datetime = self.end_datetime
        return f'{end_datetime.strftime("%d %b %Y %H:%M:%S")} ({self.timezone_info})' if end_datetime else '-'

    @admin.display(description="Editable", boolean=True)
    def is_forecast_editable(self):
        """
        Forecast can be edited until the last moment in the timeframe
        """
        end_datetime = self.end_datetime
        return timezone.now() <= end_datetime if end_datetime else True

    def generate_invoice_file(self, user_pk):
        from packaging_report.invoice_file import InvoicePdf

        return InvoicePdf(self.pk, user_pk).generate_pdf()

    def delete(self, using=None, keep_parents=False):
        self.invoice_file.delete(save=False)
        super().delete()

    def __str__(self):
        return f'Data Report No. {self.id}'


class ForecastSubmission(ReportSubmission):
    class Meta:
        verbose_name = _("Forecast Report")
        verbose_name_plural = _("Forecast Reports")

    related_report = models.OneToOneField(
        PackagingReport,
        verbose_name=_('Packaging Report'),
        related_name='related_forecast',
        on_delete=models.CASCADE,
    )

    @admin.display(description="Estimated Fees")
    def estimated_fees_display(self):
        return self.estimated_fees_str()

    def __str__(self):
        return f'Forecast Report No. {self.id}'


class FinalSubmission(ReportSubmission):
    class Meta:
        verbose_name = _("Final Report")
        verbose_name_plural = _("Final Reports")

    related_report = models.OneToOneField(
        PackagingReport,
        verbose_name=_('Packaging Report'),
        related_name='related_final_submission',
        on_delete=models.CASCADE,
    )
    fees = models.FloatField(verbose_name=_("Fees"), default=0.0, help_text=_("Report actual quantities fees"))

    @admin.display(description="Final Fees")
    def estimated_fees_display(self):
        return self.estimated_fees_str()

    def __str__(self):
        return f'Final Report No. {self.id}'


class MaterialRecord(CommonInfo):
    related_forecast_submission = models.ForeignKey(
        ForecastSubmission,
        verbose_name=_('Forecast Report'),
        related_name="material_records_queryset",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    related_final_submission = models.ForeignKey(
        FinalSubmission,
        verbose_name=_('Final Report'),
        related_name="material_records_queryset",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
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

    class Meta:
        verbose_name = _("Report Packaging entry")
        verbose_name_plural = _("Report Packaging entries")
        constraints = (
            (
                UniqueConstraint(
                    fields=[
                        'related_packaging_group',
                        'related_packaging_material',
                        'related_forecast_submission',
                        'related_final_submission',
                    ],
                    name='unique_material_record_in_report_submission',
                )
            ),
        )

    def __str__(self):
        return (
            f'Packaging entry No. {self.id} for Forecast Report No. {self.related_forecast_submission_id}'
            if self.related_forecast_submission_id
            else f'Packaging entry No. {self.id} for Final Report No. {self.related_final_submission_id}'
        )
