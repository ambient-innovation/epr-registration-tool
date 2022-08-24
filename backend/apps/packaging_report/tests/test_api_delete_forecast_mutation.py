from datetime import datetime

from django.utils.timezone import make_aware

import time_machine
from model_bakery import baker

from common.tests.test_base import BaseApiTestCase
from packaging_report.models import ForecastSubmission, MaterialRecord, PackagingReport, TimeframeType


class PackagingReportDeleteTestCase(BaseApiTestCase):
    AUTO_CREATE_USERS = True
    ALWAYS_LOGIN_USER = True
    MUTATION = """
        mutation packagingReportForecastDelete(
            $packagingReportId: ID!
        ) {
            packagingReportForecastDelete(
                packagingReportId: $packagingReportId
            )
        }
    """

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.company = cls.create_and_assign_company(cls.user)
        cls.packaging_group = baker.make_recipe('packaging.tests.packaging_group')
        cls.material = baker.make_recipe('packaging.tests.packaging_material')
        cls.packaging_report = baker.make_recipe(
            'packaging_report.tests.packaging_report',
            related_company=cls.company,
            start_month=1,
            year=2022,
            timeframe=TimeframeType.THREE_MONTHS,
        )
        cls.forecast_submission = baker.make(
            'packaging_report.ForecastSubmission',
            related_report=cls.packaging_report,
        )
        # packaging group 1
        cls.material_record_1 = baker.make(
            'packaging_report.MaterialRecord',
            related_forecast_submission=cls.forecast_submission,
            related_packaging_material=cls.material,
            related_packaging_group=cls.packaging_group,
            quantity=1,
        )

    def test_delete_not_exist_packaging_report(self):
        variables = {
            "packagingReportId": "9999",
        }
        self.query_and_assert_error(self.MUTATION, variables=variables, message="reportDoesNotExist")

    def test_delete_packaging_report_is_not_deletable(self):
        variables = {
            "packagingReportId": self.packaging_report.id,
        }
        self.query_and_assert_error(self.MUTATION, variables=variables, message='reportIsNotDeletable')

    @time_machine.travel(make_aware(datetime(year=2022, month=2, day=1)))
    def test_delete_packaging_report(self):
        variables = {
            "packagingReportId": self.packaging_report.id,
        }
        content = self.query_and_load_data(self.MUTATION, variables=variables)

        self.assertEqual(content['packagingReportForecastDelete'], 'DELETED')
        self.assertEqual(0, PackagingReport.objects.count())
        self.assertEqual(0, ForecastSubmission.objects.count())
        self.assertEqual(0, MaterialRecord.objects.count())
