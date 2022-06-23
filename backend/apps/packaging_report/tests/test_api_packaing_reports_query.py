from datetime import datetime

from django.utils.timezone import make_aware

import time_machine
from model_bakery import baker

from common.tests.test_base import BaseApiTestCase
from packaging_report.models import TimeframeType


class PackagingReportQueriesTestCase(BaseApiTestCase):
    QUERY = """
        {
            packagingReports {
                id
                packagingGroupsCount
                isForecastEditable
                isFinalReportSubmitted
                fees
            }
        }
    """

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.company = baker.make_recipe('company.tests.company')
        cls.user = baker.make_recipe('account.tests.user', related_company=cls.company)
        cls.packaging_group_1, cls.packaging_group_2 = baker.make_recipe('packaging.tests.packaging_group', _quantity=2)
        cls.material_1, cls.material_2 = baker.make_recipe('packaging.tests.packaging_material', _quantity=2)
        cls.packaging_report_in_forecast = baker.make_recipe(
            'packaging_report.tests.packaging_report',
            related_company=cls.company,
            timeframe=TimeframeType.THREE_MONTHS,
            year=2022,
            start_month=5,
        )
        cls.packaging_report_not_editable_without_final_data = baker.make_recipe(
            'packaging_report.tests.packaging_report',
            related_company=cls.company,
            timeframe=TimeframeType.THREE_MONTHS,
            year=2022,
            start_month=1,
        )
        cls.packaging_report_with_final_data = baker.make_recipe(
            'packaging_report.tests.packaging_report',
            related_company=cls.company,
            timeframe=TimeframeType.THREE_MONTHS,
            year=2022,
            start_month=2,
        )
        cls.forecast_submission = baker.make(
            'packaging_report.ForecastSubmission',
            related_report=cls.packaging_report_in_forecast,
        )
        cls.forecast_submission_2 = baker.make(
            'packaging_report.ForecastSubmission',
            related_report=cls.packaging_report_not_editable_without_final_data,
        )
        cls.final_submission = baker.make(
            'packaging_report.FinalSubmission',
            related_report=cls.packaging_report_with_final_data,
            fees=99.99,
        )
        baker.make(
            'packaging_report.MaterialRecord',
            related_forecast_submission=cls.forecast_submission_2,
            related_packaging_material=cls.material_1,
            related_packaging_group=cls.packaging_group_1,
            quantity=100,
        )
        baker.make(
            'packaging_report.MaterialRecord',
            related_final_submission=cls.final_submission,
            related_packaging_material=cls.material_1,
            related_packaging_group=cls.packaging_group_1,
            quantity=10,
        )
        # packaging group 2
        baker.make(
            'packaging_report.MaterialRecord',
            related_forecast_submission=cls.forecast_submission,
            related_packaging_material=cls.material_1,
            related_packaging_group=cls.packaging_group_1,
            quantity=1,
        )
        baker.make(
            'packaging_report.MaterialRecord',
            related_forecast_submission=cls.forecast_submission,
            related_packaging_material=cls.material_2,
            related_packaging_group=cls.packaging_group_1,
            quantity=2,
        )
        # packaging group 1
        baker.make(
            'packaging_report.MaterialRecord',
            related_forecast_submission=cls.forecast_submission,
            related_packaging_material=cls.material_1,
            related_packaging_group=cls.packaging_group_2,
            quantity=3,
        )

    def test_packaging_reports_query_without_user(self):
        self.query_and_assert_error(self.QUERY, message='not_authenticated')

    def test_packaging_reports_query_without_company(self):
        user = baker.make_recipe('account.tests.user')
        self.login(user)
        self.create_and_assign_company(user)
        data = self.query_and_load_data(self.QUERY)
        packaging_reports = data['packagingReports']
        self.assertEqual(0, len(packaging_reports))

    @time_machine.travel(make_aware(datetime(year=2022, month=6, day=23)))
    def test_packaging_reports_query(self):
        self.login_normal_user()
        data = self.query_and_load_data(self.QUERY)
        packaging_reports = data['packagingReports']
        self.assertEqual(3, len(packaging_reports))
        for report in packaging_reports:
            if report['id'] == str(self.packaging_report_in_forecast.id):
                self.assertEqual(2, report['packagingGroupsCount'])
                self.assertTrue(report['isForecastEditable'])
                self.assertFalse(report['isFinalReportSubmitted'])
                self.assertIsNone(report['fees'])
            elif report['id'] == str(self.packaging_report_with_final_data.id):
                self.assertEqual(1, report['packagingGroupsCount'])
                self.assertFalse(report['isForecastEditable'])
                self.assertTrue(report['isFinalReportSubmitted'])
                self.assertEqual('99.99', report['fees'])
            else:  # report is not editable and has no final report yet
                self.assertEqual(1, report['packagingGroupsCount'])
                self.assertFalse(report['isForecastEditable'])
                self.assertIsNone(report['fees'])
                self.assertFalse(report['isFinalReportSubmitted'])
