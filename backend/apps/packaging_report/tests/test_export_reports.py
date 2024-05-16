from django.db.models import Prefetch

from model_bakery import baker

from apps.common.tests.test_base import BaseTestCase
from apps.packaging_report.forms import CSVExportDataForm
from apps.packaging_report.models import PackagingReport, ReportTypes, TimeframeType
from apps.packaging_report.views import CSVExportDataView


class ExportReportDataTestCase(BaseTestCase):
    AUTO_CREATE_USERS = True

    @staticmethod
    def make_material_price(material, year, month, price):
        baker.make(
            'packaging.MaterialPrice', related_material=material, start_year=year, start_month=month, price_per_kg=price
        )

    @classmethod
    def create_packaging_base_data(cls):
        cls.packaging_group_1, cls.packaging_group_2 = baker.make_recipe(
            'apps.packaging.tests.packaging_group', _quantity=2
        )

        cls.material_1, cls.material_2 = baker.make_recipe('apps.packaging.tests.packaging_material', _quantity=2)
        # material No. 1 prices
        cls.make_material_price(cls.material_1, 2021, 1, 10)
        cls.make_material_price(cls.material_1, 2021, 3, 20)
        cls.make_material_price(cls.material_1, 2021, 6, 30)
        cls.make_material_price(cls.material_1, 2022, 3, 20)
        cls.make_material_price(cls.material_1, 2022, 6, 50)
        cls.make_material_price(cls.material_1, 2023, 6, 55)
        # material No. 2 prices
        cls.make_material_price(cls.material_2, 2022, 1, 100)
        cls.make_material_price(cls.material_2, 2022, 6, 150)
        cls.make_material_price(cls.material_2, 2022, 12, 175)

    @classmethod
    def create_forecast(cls, report: PackagingReport):
        forecast = baker.make(
            'packaging_report.ForecastSubmission',
            related_report=report,
        )

        baker.make(
            'packaging_report.MaterialRecord',
            related_forecast_submission=forecast,
            related_packaging_material=cls.material_1,
            related_packaging_group=cls.packaging_group_1,
            quantity=400,
        )
        baker.make(
            'packaging_report.MaterialRecord',
            related_forecast_submission=forecast,
            related_packaging_material=cls.material_2,
            related_packaging_group=cls.packaging_group_2,
            quantity=200,
        )
        return forecast

    @classmethod
    def create_final_submission(cls, report: PackagingReport):
        final_submission = baker.make('packaging_report.FinalSubmission', related_report=report, fees=1594583.33)
        baker.make(
            'packaging_report.MaterialRecord',
            related_final_submission=final_submission,
            related_packaging_material=cls.material_1,
            related_packaging_group=cls.packaging_group_1,
            quantity=500,
        )
        baker.make(
            'packaging_report.MaterialRecord',
            related_final_submission=final_submission,
            related_packaging_material=cls.material_2,
            related_packaging_group=cls.packaging_group_2,
            quantity=300,
        )
        return final_submission

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()

        # report_1: 01.2021 -> 12.2021, has forecast and final.
        # report_2: 04.2021 -> 06.2021, has forecast and final.
        # report_3: 06.2021 -> 08.2021, has forecast.
        # report_4: 09.2021 -> 11.2021, has forecast.
        cls.company = cls.create_and_assign_company(cls.user)
        cls.company_2 = baker.make_recipe('apps.company.tests.company', users_queryset=[cls.super_user], name='Abc')
        baker.make_recipe('apps.company.tests.company_contact_info', related_company=cls.company_2)
        cls.create_packaging_base_data()
        cls.report_1 = baker.make_recipe(
            'apps.packaging_report.tests.packaging_report',
            related_company=cls.company,
            timeframe=TimeframeType.TWELVE_MONTHS,
            start_month=1,
            year=2022,
        )
        cls.create_forecast(cls.report_1)
        cls.create_final_submission(cls.report_1)
        cls.report_2 = baker.make_recipe(
            'apps.packaging_report.tests.packaging_report',
            related_company=cls.company_2,
            timeframe=TimeframeType.THREE_MONTHS,
            start_month=4,
            year=2022,
        )
        cls.create_forecast(cls.report_2)
        cls.create_final_submission(cls.report_2)
        cls.report_3 = baker.make_recipe(
            'apps.packaging_report.tests.packaging_report',
            related_company=cls.company,
            timeframe=TimeframeType.THREE_MONTHS,
            start_month=6,
            year=2022,
        )
        cls.create_forecast(cls.report_3)

        cls.report_4 = baker.make_recipe(
            'apps.packaging_report.tests.packaging_report',
            related_company=cls.company_2,
            timeframe=TimeframeType.THREE_MONTHS,
            start_month=9,
            year=2022,
        )
        cls.create_forecast(cls.report_4)

    def test_get_forecast_reports_in_timeframe(self):
        reports = CSVExportDataView.get_reports_in_timeframe(
            year=2022, from_month=1, to_month=5, report_type=ReportTypes.FORCAST
        )
        self.assertEqual(2, len(reports))
        reports = CSVExportDataView.get_reports_in_timeframe(
            year=2022, from_month=1, to_month=4, report_type=ReportTypes.FORCAST
        )
        self.assertEqual(2, len(reports))
        reports = CSVExportDataView.get_reports_in_timeframe(
            year=2022, from_month=1, to_month=9, report_type=ReportTypes.FORCAST
        )
        self.assertEqual(4, len(reports))
        reports = CSVExportDataView.get_reports_in_timeframe(
            year=2022, from_month=11, to_month=11, report_type=ReportTypes.FORCAST
        )
        self.assertEqual(2, len(reports))

    def test_order(self):
        reports = CSVExportDataView.get_reports_in_timeframe(
            year=2022, from_month=1, to_month=12, report_type=ReportTypes.FORCAST
        )
        self.assertEqual(4, len(reports))
        self.assertEqual(self.report_1.pk, reports[0].id)
        self.assertEqual(self.report_3.pk, reports[1].id)
        self.assertEqual(self.report_2.pk, reports[2].id)
        self.assertEqual(self.report_4.pk, reports[3].id)

    def test_get_final_reports_in_timeframe(self):
        reports = CSVExportDataView.get_reports_in_timeframe(
            year=2022, from_month=1, to_month=5, report_type=ReportTypes.FINAL
        )
        self.assertEqual(2, len(reports))
        reports = CSVExportDataView.get_reports_in_timeframe(
            year=2022, from_month=1, to_month=6, report_type=ReportTypes.FINAL
        )
        self.assertEqual(2, len(reports))
        reports = CSVExportDataView.get_reports_in_timeframe(
            year=2022, from_month=1, to_month=12, report_type=ReportTypes.FINAL
        )
        self.assertEqual(2, len(reports))
        reports = CSVExportDataView.get_reports_in_timeframe(
            year=2022, from_month=6, to_month=12, report_type=ReportTypes.FINAL
        )
        self.assertEqual(2, len(reports))

    def test_get_data_rows(self):
        report = (
            PackagingReport.objects.filter(pk=self.report_1.pk)
            .prefetch_related(
                Prefetch('related_company', to_attr='company'),
                Prefetch('related_forecast', to_attr='forecast'),
                Prefetch('forecast__material_records_queryset', to_attr='material_records'),
                Prefetch('forecast__material_records__related_packaging_material', to_attr='material'),
                Prefetch('forecast__material_records__related_packaging_group', to_attr='packaging_group'),
            )
            .first()
        )
        with self.assertNumQueries(1):
            rows = CSVExportDataForm.get_rows_data(2022, 1, 12, ReportTypes.FORCAST, [report])
        self.assertEqual(2, len(rows))
        self.assertEqual(10, len(rows[0]))
        self.assertListEqual(
            [
                self.report_1.pk,
                'DE1000000000',
                self.company.identification_number,
                'Farwell Co',
                2022,
                'January',
                'December',
                'GROUP_1',
                'MATERIAL_1',
                400.0,
            ],
            rows[0],
        )
        self.assertListEqual(
            [
                self.report_1.pk,
                'DE1000000000',
                self.company.identification_number,
                'Farwell Co',
                2022,
                'January',
                'December',
                'GROUP_2',
                'MATERIAL_2',
                200.0,
            ],
            rows[1],
        )
