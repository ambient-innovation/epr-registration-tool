from datetime import datetime

from django.utils.timezone import make_aware

import time_machine
from model_bakery import baker

from apps.common.tests.test_base import BaseApiTestCase
from apps.packaging_report.api.types import PackagingReportsSortingOption
from apps.packaging_report.models import TimeframeType


@time_machine.travel(make_aware(datetime(year=2022, month=6, day=23)))
class PackagingReportQueriesTestCase(BaseApiTestCase):
    QUERY = """
        query {
            packagingReports {
                items {
                    id
                    packagingGroupsCount
                    isForecastEditable
                    isFinalReportSubmitted
                    fees
                }
            }
        }
    """

    QUERY_WITH_FILTER = """
            query (
                $pagination: PaginationInput,
                $filter: PackagingReportsFilterInput,
                $sorting: PackagingReportsSortingOption
            ) {
                packagingReports(
                    pagination: $pagination,
                    filter: $filter,
                    sorting: $sorting
                ) {
                    items {
                        id
                        year
                        startMonth
                    }
                    pageInfo {
                        currentPage
                        numPages
                        hasNextPage
                        totalCount
                        perPage
                    }
                }
            }
        """

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.company = baker.make_recipe('apps.company.tests.company')
        cls.user = baker.make_recipe('apps.account.tests.user', related_company=cls.company)
        cls.packaging_group_1, cls.packaging_group_2 = baker.make_recipe(
            'apps.packaging.tests.packaging_group', _quantity=2
        )
        cls.material_1, cls.material_2 = baker.make_recipe('apps.packaging.tests.packaging_material', _quantity=2)
        cls.packaging_report_in_forecast = baker.make_recipe(
            'apps.packaging_report.tests.packaging_report',
            related_company=cls.company,
            timeframe=TimeframeType.THREE_MONTHS,
            year=2022,
            start_month=5,
        )
        cls.packaging_report_not_editable_without_final_data = baker.make_recipe(
            'apps.packaging_report.tests.packaging_report',
            related_company=cls.company,
            timeframe=TimeframeType.THREE_MONTHS,
            year=2022,
            start_month=1,
        )
        cls.packaging_report_with_final_data = baker.make_recipe(
            'apps.packaging_report.tests.packaging_report',
            related_company=cls.company,
            timeframe=TimeframeType.THREE_MONTHS,
            year=2021,
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
        user = baker.make_recipe('apps.account.tests.user')
        self.login(user)
        self.create_and_assign_company(user)
        data = self.query_and_load_data(self.QUERY)
        packaging_reports = data['packagingReports']['items']
        self.assertEqual(0, len(packaging_reports))

    def test_packaging_reports_query(self):
        self.login_normal_user()
        data = self.query_and_load_data(self.QUERY)
        packaging_reports = data['packagingReports']['items']
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

    def test_packaging_reports_query_pagination_page_1(self):
        self.login_normal_user()
        data = self.query_and_load_data(
            self.QUERY_WITH_FILTER,
            variables={'pagination': {'page': 1, 'limit': 2}},
        )
        packaging_reports = data['packagingReports']['items']
        page_info = data['packagingReports']['pageInfo']
        self.assertEqual(2, len(packaging_reports))
        self.assertEqual(1, page_info['currentPage'])
        self.assertEqual(2, page_info['numPages'])
        self.assertEqual(True, page_info['hasNextPage'])
        self.assertEqual(3, page_info['totalCount'])
        self.assertEqual(2, page_info['perPage'])

    def test_packaging_reports_query_pagination_page_2(self):
        self.login_normal_user()
        data = self.query_and_load_data(
            self.QUERY_WITH_FILTER,
            variables={'pagination': {'page': 2, 'limit': 2}},
        )
        packaging_reports = data['packagingReports']['items']
        page_info = data['packagingReports']['pageInfo']
        self.assertEqual(1, len(packaging_reports))
        self.assertEqual(2, page_info['currentPage'])
        self.assertEqual(2, page_info['numPages'])
        self.assertEqual(False, page_info['hasNextPage'])
        self.assertEqual(3, page_info['totalCount'])
        self.assertEqual(2, page_info['perPage'])

    def test_packaging_reports_query_filter_by_year(self):
        self.login_normal_user()
        data = self.query_and_load_data(
            self.QUERY_WITH_FILTER,
            variables={'filter': {'year': 2022}},
        )
        packaging_reports = data['packagingReports']['items']
        self.assertEqual(2, len(packaging_reports))
        for packaging_report in packaging_reports:
            self.assertEqual(2022, packaging_report['year'])

    def test_packaging_reports_query_sort_by_newest(self):
        self.login_normal_user()
        data = self.query_and_load_data(
            self.QUERY_WITH_FILTER,
        )
        packaging_reports = data['packagingReports']['items']
        self.assertEqual(
            [
                (2022, 5),
                (2022, 1),
                (2021, 2),
            ],
            [(p['year'], p['startMonth']) for p in packaging_reports],
        )

    def test_packaging_reports_query_sort_by_oldest(self):
        self.login_normal_user()
        data = self.query_and_load_data(
            self.QUERY_WITH_FILTER, variables={'sorting': PackagingReportsSortingOption.OLDEST_FIRST.value}
        )
        packaging_reports = data['packagingReports']['items']
        self.assertEqual(
            [
                (2021, 2),
                (2022, 1),
                (2022, 5),
            ],
            [(p['year'], p['startMonth']) for p in packaging_reports],
        )
