from datetime import datetime

import time_machine
from django.core.exceptions import ValidationError
from django.utils.timezone import make_aware
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
        # baker.make_recipe('company.tests.company', users_queryset=[cls.user])
        cls.company = cls.create_and_assign_company(cls.user)
        cls.packaging_group = baker.make_recipe('packaging.tests.packaging_group')
        cls.material = baker.make_recipe('packaging.tests.packaging_material')

    def _create_packaging_report(self, year, start_month, timeframe, company=None):
        return baker.make_recipe(
            'packaging_report.tests.packaging_report',
            related_company=self.company if not company else company,
            timeframe=timeframe,
            year=year,
            start_month=start_month,
            timezone_info='Asia/Amman',
        )

    @time_machine.travel(make_aware(datetime(year=2022, month=3, day=1)))
    def test_submit_new_packaging_report_in_the_past(self):
        variables = {
            "year": 2022,
            "startMonth": 3,
            "tzInfo": 'Europe/Madrid',
            "timeframe": "THREE_MONTHS",
            "packagingRecords": [
                {
                    "packagingGroupId": self.packaging_group.id,
                    "materialRecords": {"materialId": self.material.id, "quantity": 9},
                }
            ],
        }
        self.query_and_assert_error(self.MUTATION, variables=variables, message="startDateIsInvalid")

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
        self.assertEqual(1, ForecastSubmission.objects.count())
        self.assertEqual(1, MaterialRecord.objects.count())
        material_record = MaterialRecord.objects.first()
        self.assertEqual(
            self.packaging_group.id,
            material_record.related_packaging_group.id,
        )
        self.assertEqual(self.material.id, material_record.related_packaging_material.id)
        self.assertEqual(ForecastSubmission.objects.first().id, material_record.related_forecast_submission.id)

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
            message='startDateIsInvalid',
        )

    @time_machine.travel(make_aware(datetime(year=2023, month=8, day=1)))
    def test_submit_new_packaging_report_overlap_with_another(self):
        self._create_packaging_report(2023, 8, 3)

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
        self.query_and_assert_error(
            self.MUTATION,
            variables=variables,
            message='timeframeOverlap',
        )

    @time_machine.travel(make_aware(datetime(year=2023, month=8, day=1)))
    def test_submit_new_packaging_report_without_records(self):
        variables = {
            "year": 2023,
            "startMonth": 9,
            "tzInfo": 'Europe/Madrid',
            "timeframe": "THREE_MONTHS",
            "packagingRecords": [],
        }
        self.query_and_assert_error(
            self.MUTATION,
            variables=variables,
            message='packagingRecordsEmpty',
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
            message='startDateIsInvalid',
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
            message='startDateIsInvalid',
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
            message='startDateIsInvalid',
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
            message='startDateIsInvalid',
        )

    def test_overlapping_case_one(self):
        # existing reports
        # 1-2-3-4-5-6-7-8-9-10-11-12
        # 1-2-3---------------------
        # --------5-6-7-------------
        # --------------8-9-10-11-12
        self._create_packaging_report(2022, 1, 3)
        self._create_packaging_report(2022, 5, 3)
        self._create_packaging_report(2022, 8, 3)
        # reports which overlap with already existing reports
        test_report_1 = PackagingReport(
            related_company=self.company, start_month=1, year=2022, timeframe=3, timezone_info='Asia/Amman'
        )
        test_report_2 = PackagingReport(
            related_company=self.company, start_month=6, year=2022, timeframe=1, timezone_info='Asia/Amman'
        )
        test_report_3 = PackagingReport(
            related_company=self.company, start_month=6, year=2022, timeframe=3, timezone_info='Asia/Amman'
        )
        test_report_4 = PackagingReport(
            related_company=self.company, start_month=9, year=2022, timeframe=1, timezone_info='Asia/Amman'
        )
        test_report_5 = PackagingReport(
            related_company=self.company, start_month=9, year=2022, timeframe=3, timezone_info='Asia/Amman'
        )
        test_report_6 = PackagingReport(
            related_company=self.company, start_month=4, year=2022, timeframe=3, timezone_info='Asia/Amman'
        )
        with self.assertRaises(ValidationError) as context:
            test_report_1.full_clean()
        self.assertEqual(
            'Report No. 1 overlaps with this report timeframe.', context.exception.message_dict['timeframe'][0]
        )
        with self.assertRaises(ValidationError) as context:
            test_report_3.full_clean()
        self.assertEqual(
            'Reports with No. (3, 2) overlap with this report timeframe.',
            context.exception.message_dict['timeframe'][0],
        )

        self.assertEqual(1, len(test_report_1.get_overlapping_reports()))
        self.assertEqual(1, len(test_report_2.get_overlapping_reports()))
        self.assertEqual(2, len(test_report_3.get_overlapping_reports()))
        self.assertEqual(1, len(test_report_4.get_overlapping_reports()))
        self.assertEqual(1, len(test_report_5.get_overlapping_reports()))
        self.assertEqual(1, len(test_report_6.get_overlapping_reports()))
        # report which do not overlap with already existing reports
        test_report_1 = PackagingReport(related_company=self.company, start_month=4, year=2022, timeframe=1)
        self.assertEqual(0, len(test_report_1.get_overlapping_reports()))
        # different year must be fine
        test_report_1 = PackagingReport(
            related_company=self.company, start_month=1, year=2021, timeframe=3, timezone_info='Asia/Amman'
        )
        test_report_2 = PackagingReport(
            related_company=self.company, start_month=6, year=2023, timeframe=1, timezone_info='Asia/Amman'
        )
        test_report_3 = PackagingReport(
            related_company=self.company, start_month=6, year=2023, timeframe=3, timezone_info='Asia/Amman'
        )
        test_report_4 = PackagingReport(
            related_company=self.company, start_month=9, year=2023, timeframe=1, timezone_info='Asia/Amman'
        )
        test_report_5 = PackagingReport(
            related_company=self.company, start_month=9, year=2023, timeframe=3, timezone_info='Asia/Amman'
        )
        test_report_6 = PackagingReport(
            related_company=self.company, start_month=4, year=2023, timeframe=3, timezone_info='Asia/Amman'
        )
        self.assertEqual(0, len(test_report_1.get_overlapping_reports()))
        self.assertEqual(0, len(test_report_2.get_overlapping_reports()))
        self.assertEqual(0, len(test_report_3.get_overlapping_reports()))
        self.assertEqual(0, len(test_report_4.get_overlapping_reports()))
        self.assertEqual(0, len(test_report_5.get_overlapping_reports()))
        self.assertEqual(0, len(test_report_6.get_overlapping_reports()))

    def test_overlapping_case_two(self):
        self._create_packaging_report(2022, 5, 3)
        # reports which overlap with already existing report
        test_report_1 = PackagingReport(
            related_company=self.company, start_month=4, year=2022, timeframe=3, timezone_info='Asia/Amman'
        )
        test_report_2 = PackagingReport(
            related_company=self.company, start_month=5, year=2022, timeframe=1, timezone_info='Asia/Amman'
        )
        test_report_3 = PackagingReport(
            related_company=self.company, start_month=5, year=2022, timeframe=3, timezone_info='Asia/Amman'
        )
        test_report_4 = PackagingReport(
            related_company=self.company, start_month=6, year=2022, timeframe=1, timezone_info='Asia/Amman'
        )
        test_report_5 = PackagingReport(
            related_company=self.company, start_month=6, year=2022, timeframe=3, timezone_info='Asia/Amman'
        )
        test_report_6 = PackagingReport(
            related_company=self.company, start_month=7, year=2022, timeframe=1, timezone_info='Asia/Amman'
        )
        test_report_7 = PackagingReport(
            related_company=self.company, start_month=7, year=2022, timeframe=3, timezone_info='Asia/Amman'
        )
        test_report_8 = PackagingReport(
            related_company=self.company, start_month=1, year=2022, timeframe=12, timezone_info='Asia/Amman'
        )

        self.assertNotEqual(0, len(test_report_1.get_overlapping_reports()))
        self.assertNotEqual(0, len(test_report_2.get_overlapping_reports()))
        self.assertNotEqual(0, len(test_report_3.get_overlapping_reports()))
        self.assertNotEqual(0, len(test_report_4.get_overlapping_reports()))
        self.assertNotEqual(0, len(test_report_5.get_overlapping_reports()))
        self.assertNotEqual(0, len(test_report_6.get_overlapping_reports()))
        self.assertNotEqual(0, len(test_report_7.get_overlapping_reports()))
        self.assertNotEqual(0, len(test_report_8.get_overlapping_reports()))
        # reports which do not overlap with already existing report
        test_report_1 = PackagingReport(
            related_company=self.company, start_month=8, year=2022, timeframe=1, timezone_info='Asia/Amman'
        )
        test_report_2 = PackagingReport(
            related_company=self.company, start_month=8, year=2022, timeframe=3, timezone_info='Asia/Amman'
        )
        test_report_3 = PackagingReport(
            related_company=self.company, start_month=2, year=2022, timeframe=3, timezone_info='Asia/Amman'
        )
        test_report_4 = PackagingReport(
            related_company=self.company, start_month=4, year=2022, timeframe=1, timezone_info='Asia/Amman'
        )
        self.assertEqual(0, len(test_report_1.get_overlapping_reports()))
        self.assertEqual(0, len(test_report_2.get_overlapping_reports()))
        self.assertEqual(0, len(test_report_3.get_overlapping_reports()))
        self.assertEqual(0, len(test_report_4.get_overlapping_reports()))
