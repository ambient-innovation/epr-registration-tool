from datetime import datetime

from django.utils.timezone import make_aware

import time_machine
from model_bakery import baker

from common.tests.test_base import BaseApiTestCase
from packaging_report.models import ForecastSubmission, MaterialRecord, PackagingReport


class PackagingReportSubmissionTestCase(BaseApiTestCase):
    AUTO_CREATE_USERS = True
    ALWAYS_LOGIN_USER = True
    MUTATION = """
        mutation packagingReportForecastSubmit(
            $year: Int!,
            $startMonth: Int!,
            $tzInfo: String!,
            $timeframe: TimeframeType!,
            $packagingRecords: [PackagingGroupInput!]!
        ) {
            packagingReportForecastSubmit(
                year: $year,
                startMonth: $startMonth,
                tzInfo: $tzInfo,
                timeframe: $timeframe,
                packagingRecords: $packagingRecords
            )
        }
    """

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        baker.make_recipe('company.tests.company', users_queryset=[cls.user])
        cls.packaging_group = baker.make_recipe('packaging.tests.packaging_group')
        cls.material = baker.make_recipe('packaging.tests.packaging_material')

    @time_machine.travel(make_aware(datetime(year=2022, month=3, day=1)))
    def test_submit_new_packaging_report(self):
        variables = {
            "year": 2023,
            "startMonth": 9,
            "tzInfo": 'Europe/Madrid',
            "timeframe": "THREE_MONTHS",
            "packagingRecords": [
                {
                    "packagingGroupId": self.packaging_group.id,
                    "materialRecords": {"materialId": self.material.id, "quantity": 9},
                }
            ],
        }
        content = self.query_and_load_data(self.MUTATION, variables=variables)

        self.assertEqual(content['packagingReportForecastSubmit'], 'CREATED')
        self.assertEqual(1, PackagingReport.objects.count())
        self.assertEqual(2023, PackagingReport.objects.first().year)
        self.assertEqual(9, PackagingReport.objects.first().start_month)
        self.assertEqual('Europe/Madrid', PackagingReport.objects.first().timezone_info)
        self.assertTrue(1, ForecastSubmission.objects.count())
        self.assertTrue(1, MaterialRecord.objects.count())
        material_record = MaterialRecord.objects.first()
        self.assertTrue(
            self.packaging_group.id,
            material_record.related_packaging_group,
        )
        self.assertTrue(self.material.id, material_record.related_packaging_material)
        self.assertTrue(ForecastSubmission.objects.first().id, material_record.related_submission)

    def test_submit_new_packaging_report_start_date_validation_year(self):
        variables = {
            "year": 2000,
            "startMonth": 10,
            "tzInfo": 'Europe/Madrid',
            "timeframe": "THREE_MONTHS",
            "packagingRecords": [
                {
                    "packagingGroupId": self.packaging_group.id,
                    "materialRecords": {"materialId": self.material.id, "quantity": 9},
                }
            ],
        }
        self.query_and_assert_error(
            self.MUTATION,
            variables=variables,
            message='validationError',
        )

    def test_submit_new_packaging_report_start_date_validation_month(self):
        variables = {
            "year": 2022,
            "startMonth": 20,
            "tzInfo": 'Europe/Madrid',
            "timeframe": "THREE_MONTHS",
            "packagingRecords": [
                {
                    "packagingGroupId": self.packaging_group.id,
                    "materialRecords": {"materialId": self.material.id, "quantity": 9},
                }
            ],
        }
        self.query_and_assert_error(
            self.MUTATION,
            variables=variables,
            message='validationError',
        )

    def test_submit_new_packaging_report_start_date_validation_timeframe(self):
        variables = {
            "year": 2022,
            "startMonth": 11,
            "tzInfo": 'Europe/Madrid',
            "timeframe": "THREE_MONTHS",
            "packagingRecords": [
                {
                    "packagingGroupId": self.packaging_group.id,
                    "materialRecords": {"materialId": self.material.id, "quantity": 9},
                }
            ],
        }
        self.query_and_assert_error(
            self.MUTATION,
            variables=variables,
            message='validationError',
        )

    def test_submit_new_packaging_report_start_date_validation_should_validate_timezone(self):
        variables = {
            "year": 2022,
            "startMonth": 6,
            "tzInfo": 'Europe/NotExist',
            "timeframe": "THREE_MONTHS",
            "packagingRecords": [
                {
                    "packagingGroupId": self.packaging_group.id,
                    "materialRecords": {"materialId": self.material.id, "quantity": 9},
                }
            ],
        }
        self.query_and_assert_error(
            self.MUTATION,
            variables=variables,
            message='validationError',
        )

    def test_submit_new_packaging_report_with_not_exist_material(self):
        variables = {
            "year": 2022,
            "startMonth": 6,
            "tzInfo": 'Europe/NotExist',
            "timeframe": "THREE_MONTHS",
            "packagingRecords": [
                {"packagingGroupId": self.packaging_group.id, "materialRecords": {"materialId": "200", "quantity": 9}}
            ],
        }
        self.query_and_assert_error(
            self.MUTATION,
            variables=variables,
            message='validationError',
        )
