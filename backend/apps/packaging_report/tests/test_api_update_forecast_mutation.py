from datetime import datetime
from zoneinfo import ZoneInfo

from django.utils.timezone import make_aware

import pytz
import time_machine
from model_bakery import baker

from common.tests.test_base import BaseApiTestCase
from packaging_report.models import ForecastSubmission, MaterialRecord, PackagingReport, TimeframeType


class PackagingReportUpdateTestCase(BaseApiTestCase):
    AUTO_CREATE_USERS = True
    ALWAYS_LOGIN_USER = True
    MUTATION = """
        mutation packagingReportForecastUpdate(
            $packagingReportId: ID!
            $packagingRecords: [PackagingGroupInput!]!
        ) {
            packagingReportForecastUpdate(
                packagingReportId: $packagingReportId
                packagingRecords: $packagingRecords
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

    def test_update_not_exist_packaging_report(self):
        variables = {
            "packagingReportId": "9999",
            "packagingRecords": [
                {
                    "packagingGroupId": self.packaging_group.id,
                    "materialRecords": {"materialId": self.material.id, "quantity": 9},
                }
            ],
        }
        self.query_and_assert_error(self.MUTATION, variables=variables, message="reportDoesNotExist")

    def test_update_packaging_report_is_not_editable(self):
        variables = {
            "packagingReportId": self.packaging_report.id,
            "packagingRecords": [
                {
                    "packagingGroupId": self.packaging_group.id,
                    "materialRecords": {"materialId": self.material.id, "quantity": 20},
                }
            ],
        }
        self.query_and_assert_error(self.MUTATION, variables=variables, message='reportIsNotEditable')

    @time_machine.travel(
        datetime(year=2022, month=3, day=31, hour=23, minute=59, second=0, microsecond=0, tzinfo=ZoneInfo('Asia/Amman'))
    )
    def test_update_packaging_report_is_editable_in_last_minutes(self):
        packaging_report: PackagingReport = baker.make_recipe(
            'packaging_report.tests.packaging_report',
            related_company=self.company,
            start_month=1,
            year=2022,
            timezone_info='Asia/Amman',
            timeframe=TimeframeType.THREE_MONTHS,
        )
        self.assertTrue(packaging_report.is_forecast_editable())

    @time_machine.travel(
        datetime(
            year=2022, month=4, day=1, hour=1, minute=0, second=0, microsecond=0, tzinfo=pytz.timezone('Asia/Amman')
        )
    )
    def test_update_packaging_report_is_not_editable_timezone(self):
        packaging_report: PackagingReport = baker.make_recipe(
            'packaging_report.tests.packaging_report',
            related_company=self.company,
            start_month=1,
            year=2022,
            timezone_info='Asia/Amman',
            timeframe=TimeframeType.THREE_MONTHS,
        )
        self.assertFalse(packaging_report.is_forecast_editable())

    @time_machine.travel(make_aware(datetime(year=2022, month=2, day=1)))
    def test_update_packaging_report_without_records(self):
        variables = {
            "packagingReportId": self.packaging_report.id,
            "packagingRecords": [],
        }
        self.query_and_assert_error(self.MUTATION, variables=variables, message="packagingRecordsEmpty")

    @time_machine.travel(make_aware(datetime(year=2022, month=2, day=1)))
    def test_update_packaging_report(self):
        variables = {
            "packagingReportId": self.packaging_report.id,
            "packagingRecords": [
                {
                    "packagingGroupId": self.packaging_group.id,
                    "materialRecords": {"materialId": self.material.id, "quantity": 20},
                }
            ],
        }
        content = self.query_and_load_data(self.MUTATION, variables=variables)

        self.assertEqual(content['packagingReportForecastUpdate'], 'UPDATED')
        self.assertEqual(1, PackagingReport.objects.count())
        self.assertEqual(2022, PackagingReport.objects.first().year)
        self.assertEqual(1, PackagingReport.objects.first().start_month)
        self.assertEqual('Asia/Amman', PackagingReport.objects.first().timezone_info)
        self.assertEqual(1, ForecastSubmission.objects.count())
        self.assertEqual(1, MaterialRecord.objects.count())
        material_record = MaterialRecord.objects.first()
        self.assertEqual(
            self.packaging_group.id,
            material_record.related_packaging_group.id,
        )
        self.assertEqual(self.material.id, material_record.related_packaging_material.id)
        self.assertEqual(ForecastSubmission.objects.first().id, material_record.related_forecast_submission.id)
        self.assertEqual(20, material_record.quantity)
