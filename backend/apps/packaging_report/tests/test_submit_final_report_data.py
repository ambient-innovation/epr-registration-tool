from datetime import datetime

from django.core import mail
from django.utils.timezone import make_aware

import time_machine
from model_bakery import baker

from common.tests.test_base import BaseApiTestCase
from packaging_report.models import PackagingReport, TimeframeType


class PackagingReportUpdateTestCase(BaseApiTestCase):
    AUTO_CREATE_USERS = True
    ALWAYS_LOGIN_USER = True
    MUTATION = """
        mutation packagingReportFinalDataSubmit(
            $packagingReportId: ID!
            $packagingRecords: [PackagingGroupInput!]!
        ) {
            packagingReportFinalDataSubmit(
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

        baker.make_recipe(
            'packaging.tests.packaging_material_price',
            start_year=2020,
            start_month=6,
            price_per_kg=15,
            related_material=cls.material,
        )
        # Data Report No. 1
        cls.packaging_report_1 = baker.make_recipe(
            'packaging_report.tests.packaging_report',
            related_company=cls.company,
            start_month=1,
            year=2022,
            timeframe=TimeframeType.THREE_MONTHS,
        )
        cls.forecast_submission_1 = baker.make(
            'packaging_report.ForecastSubmission',
            related_report=cls.packaging_report_1,
        )

        baker.make(
            'packaging_report.MaterialRecord',
            related_forecast_submission=cls.forecast_submission_1,
            related_packaging_material=cls.material,
            related_packaging_group=cls.packaging_group,
            quantity=1,
        )
        # Data Report No. 2
        cls.packaging_report_2 = baker.make_recipe(
            'packaging_report.tests.packaging_report',
            related_company=cls.company,
            start_month=1,
            year=2022,
            timeframe=TimeframeType.THREE_MONTHS,
        )

        cls.forecast_submission_2 = baker.make(
            'packaging_report.ForecastSubmission',
            related_report=cls.packaging_report_2,
        )
        cls.final_submission_2 = baker.make(
            'packaging_report.FinalSubmission',
            related_report=cls.packaging_report_2,
        )
        baker.make(
            'packaging_report.MaterialRecord',
            related_forecast_submission=cls.forecast_submission_2,
            related_packaging_material=cls.material,
            related_packaging_group=cls.packaging_group,
            quantity=10,
        )
        baker.make(
            'packaging_report.MaterialRecord',
            related_final_submission=cls.final_submission_2,
            related_packaging_material=cls.material,
            related_packaging_group=cls.packaging_group,
            quantity=10,
        )

    @time_machine.travel(make_aware(datetime(year=2022, month=2, day=1)))
    def test_submit_final_data_to_not_ready_report(self):
        variables = {
            "packagingReportId": self.packaging_report_1.id,
            "packagingRecords": [
                {
                    "packagingGroupId": self.packaging_group.id,
                    "materialRecords": {"materialId": self.material.id, "quantity": 9},
                }
            ],
        }
        self.query_and_assert_error(self.MUTATION, variables=variables, message="cannotSubmitFinalReportYet")

    def test_submit_final_data_to_already_submitted_report(self):
        variables = {
            "packagingReportId": self.packaging_report_2.id,
            "packagingRecords": [
                {
                    "packagingGroupId": self.packaging_group.id,
                    "materialRecords": {"materialId": self.material.id, "quantity": 9},
                }
            ],
        }
        self.query_and_assert_error(self.MUTATION, variables=variables, message="finalReportAlreadySubmitted")

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

    @time_machine.travel(make_aware(datetime(year=2022, month=5, day=1)))
    def test_submit_packaging_report_final_data_without_records(self):
        variables = {
            "packagingReportId": self.packaging_report_1.id,
            "packagingRecords": [],
        }
        self.query_and_assert_error(self.MUTATION, variables=variables, message="packagingRecordsEmpty")

    @time_machine.travel(make_aware(datetime(year=2022, month=5, day=1)))
    def test_submit_packaging_report_final_data(self):
        variables = {
            "packagingReportId": self.packaging_report_1.id,
            "packagingRecords": [
                {
                    "packagingGroupId": self.packaging_group.id,
                    "materialRecords": {"materialId": self.material.id, "quantity": 20},
                }
            ],
        }
        content = self.query_and_load_data(self.MUTATION, variables=variables)
        self.assertEqual(content['packagingReportFinalDataSubmit'], 'CREATED')

        report = PackagingReport.objects.get(pk=self.packaging_report_1.id)
        self.assertEqual(2, PackagingReport.objects.count())
        self.assertEqual(2022, report.year)
        self.assertEqual(1, report.start_month)
        self.assertEqual('Asia/Amman', report.timezone_info)

        forecast = getattr(report, 'related_forecast', None)
        final_submission = getattr(report, 'related_final_submission', None)

        # check forecast not touched
        self.assertIsNotNone(forecast)
        self.assertEqual(1, forecast.material_records_queryset.count())
        material_record = forecast.material_records_queryset.first()
        self.assertEqual(
            self.packaging_group.id,
            material_record.related_packaging_group.id,
        )
        self.assertEqual(self.material.id, material_record.related_packaging_material.id)
        self.assertEqual(1, material_record.quantity)

        # check final submission is created
        self.assertIsNotNone(final_submission)
        self.assertEqual(1, final_submission.material_records_queryset.count())
        material_record = final_submission.material_records_queryset.first()
        self.assertEqual(
            self.packaging_group.id,
            material_record.related_packaging_group.id,
        )
        self.assertEqual(self.material.id, material_record.related_packaging_material.id)
        self.assertEqual(20, material_record.quantity)
        self.assertIsNotNone(report.invoice_file)
        self.assertEqual(1, len(mail.outbox))
        self.assertEqual([self.user.email], mail.outbox[0].to)
        self.assertEqual('noreply@ambient.digital', mail.outbox[0].from_email)
