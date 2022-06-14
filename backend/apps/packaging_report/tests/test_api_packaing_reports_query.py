from datetime import datetime

from django.utils.timezone import make_aware

import time_machine
from model_bakery import baker

from common.tests.test_base import BaseApiTestCase


class PackagingReportQueriesTestCase(BaseApiTestCase):
    QUERY = """
        {
            packagingReports {
                id
                packagingGroupsCount
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
        cls.packaging_report = baker.make_recipe('packaging_report.tests.packaging_report', related_company=cls.company)
        cls.forecast_submission = baker.make(
            'packaging_report.ForecastSubmission',
            related_report=cls.packaging_report,
        )
        # packaging group 2
        cls.material_record_1 = baker.make(
            'packaging_report.MaterialRecord',
            related_submission=cls.forecast_submission,
            related_packaging_material=cls.material_1,
            related_packaging_group=cls.packaging_group_1,
            quantity=1,
        )
        cls.material_record_1 = baker.make(
            'packaging_report.MaterialRecord',
            related_submission=cls.forecast_submission,
            related_packaging_material=cls.material_2,
            related_packaging_group=cls.packaging_group_1,
            quantity=2,
        )
        # packaging group 1
        cls.material_record_1 = baker.make(
            'packaging_report.MaterialRecord',
            related_submission=cls.forecast_submission,
            related_packaging_material=cls.material_1,
            related_packaging_group=cls.packaging_group_2,
            quantity=3,
        )

    def test_packaging_reports_query_without_user(self):
        self.query_and_assert_error(self.QUERY, message='not_authenticated')

    def test_packaging_reports_query_without_company(self):
        user = baker.make_recipe('account.tests.user')
        self.login(user)
        data = self.query_and_load_data(self.QUERY)
        packaging_reports = data['packagingReports']
        self.assertEqual(0, len(packaging_reports))

    @time_machine.travel(make_aware(datetime(year=2022, month=6, day=1)))
    def test_packaging_reports_query(self):
        self.login_normal_user()
        data = self.query_and_load_data(self.QUERY)
        packaging_reports = data['packagingReports']
        self.assertEqual(1, len(packaging_reports))
        self.assertEqual(2, packaging_reports[0]['packagingGroupsCount'])
