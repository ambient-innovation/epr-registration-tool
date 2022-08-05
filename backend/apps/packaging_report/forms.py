import csv
import typing
from builtins import int

from django import forms
from django.http import StreamingHttpResponse
from django.utils.translation import gettext_lazy as _

from common.models import Month
from company.models import Company
from packaging_report.models import MaterialRecord, PackagingReport, ReportTypes


class Echo:
    """An object that implements just the write method of the file-like
    interface.
    """

    def write(self, value):
        """Write the value by returning it, instead of storing in a buffer."""
        return value


class ExcelSemicolon(csv.excel):
    delimiter = ';'


class CSVExportDataForm(forms.Form):
    year = forms.ChoiceField(help_text=_('You see Years, which has at least one report.'))
    from_month = forms.ChoiceField(choices=Month.choices, initial=1)
    to_month = forms.ChoiceField(choices=Month.choices, initial=12)
    report_type = forms.ChoiceField(choices=ReportTypes.choices)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        year_choices = []

        try:
            year_choices = [(year, year) for year in set(PackagingReport.objects.values_list('year', flat=True))]
        except PackagingReport.DoesNotExist:
            # the year field is required, so it will raise an error on submit.
            pass

        self.fields['year'].choices = year_choices

    @staticmethod
    def get_rows_data(year, from_month, to_month, report_type, reports: typing.List[PackagingReport]):
        rows = []
        for report in reports:
            company: Company = report.related_company
            start_month = report.start_month if report.start_month >= int(from_month) else int(from_month)
            end_month = report.end_datetime.month if report.end_datetime.month <= int(to_month) else int(to_month)
            shared_columns = [
                report.id,
                company.registration_number,
                company.identification_number,
                company.name,
                year,
                Month.get_label_by_value(int(start_month)),
                Month.get_label_by_value(int(end_month)),
            ]
            submission = (
                getattr(report, 'forecast', None)
                if int(report_type) == ReportTypes.FORCAST
                else getattr(report, 'final_submission', None)
            )
            material_records: typing.List[MaterialRecord] = getattr(submission, 'material_records', [])
            for material_record in material_records:
                row = []
                sum_quantity = material_record.quantity
                monthly_quantity = sum_quantity / report.timeframe
                row.append(material_record.packaging_group.name)
                row.append(material_record.material.name)
                row.append(round(monthly_quantity * (end_month - start_month + 1), 2))
                rows.append([*shared_columns, *row])
        return rows

    def export_to_csv(self, year, from_month, to_month, report_type, reports: typing.List[PackagingReport]):
        # see https://docs.djangoproject.com/en/4.0/howto/outputting-csv/#streaming-large-csv-files
        pseudo_buffer = Echo()
        writer = csv.writer(pseudo_buffer, dialect=ExcelSemicolon)
        header_row = [
            'Report ID',
            'Company ID',
            'National ID',
            'Name',
            'year',
            'From',
            'Until',
            'Group',
            'Material',
            'Quantity in period',
        ]
        rows = [header_row, *self.get_rows_data(year, from_month, to_month, report_type, reports)]
        return StreamingHttpResponse(
            (writer.writerow(row) for row in rows),
            content_type="text/csv",
            headers={
                'Content-Disposition': f'attachment; filename="reported-material-export_'
                f'{year}-{from_month}_{year}-{to_month}.csv"'
            },
        )
