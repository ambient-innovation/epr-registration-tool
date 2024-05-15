from model_bakery import baker

from apps.common.tests.test_base import BaseApiTestCase


class PackagingReportDetailsQueriesTestCase(BaseApiTestCase):
    AUTO_CREATE_USERS = True
    QUERY = """
       query packagingReportForecastDetails ($packagingReportId:ID!) {
          packagingReportForecastDetails(packagingReportId: $packagingReportId) {
            id
            timeframe
            year
            startMonth
            timezoneInfo
            forecast {
              id
              materialRecords {
                id
                quantity
                packagingGroup {
                  id
                  name
                }
                material {
                  id
                  name
                }
              }
            }
          }
        }
    """

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.test_company = baker.make_recipe('company.tests.company')
        cls.test_user = baker.make_recipe('account.tests.user', related_company=cls.test_company)
        cls.company = cls.create_and_assign_company(cls.user)

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
            related_forecast_submission=cls.forecast_submission,
            related_packaging_material=cls.material_1,
            related_packaging_group=cls.packaging_group_1,
            quantity=1,
        )
        cls.material_record_1 = baker.make(
            'packaging_report.MaterialRecord',
            related_forecast_submission=cls.forecast_submission,
            related_packaging_material=cls.material_2,
            related_packaging_group=cls.packaging_group_1,
            quantity=2,
        )
        # packaging group 1
        cls.material_record_1 = baker.make(
            'packaging_report.MaterialRecord',
            related_forecast_submission=cls.forecast_submission,
            related_packaging_material=cls.material_1,
            related_packaging_group=cls.packaging_group_2,
            quantity=3,
        )
        cls.variables = {'packagingReportId': cls.packaging_report.id}

    def test_packaging_reports_query_without_user(self):
        self.query_and_assert_error(self.QUERY, message='not_authenticated', variables=self.variables)

    def test_user_requesting_not_company_report_details(self):
        self.login(self.test_user)
        self.create_and_assign_company(self.test_user)
        data = self.query_and_load_data(self.QUERY, variables=self.variables)
        packaging_report = data['packagingReportForecastDetails']
        self.assertIsNone(packaging_report)

    def test_user_requesting_company_report_details(self):
        self.login(self.user)
        with self.assertNumQueries(9):
            data = self.query_and_load_data(self.QUERY, variables=self.variables)
        packaging_report = data['packagingReportForecastDetails']
        self.assertIsNotNone(packaging_report)
        self.assertEqual(str(self.packaging_report.id), packaging_report['id'])
        self.assertEqual('THREE_MONTHS', packaging_report['timeframe'])
        self.assertEqual(self.packaging_report.start_month, packaging_report['startMonth'])
        forecast = packaging_report['forecast']
        self.assertIsNotNone(forecast)
        self.assertEqual(str(self.forecast_submission.id), forecast['id'])
        material_records = forecast['materialRecords']
        self.assertEqual(3, len(material_records))
        for material_record in material_records:
            self.assertIsNotNone(material_record['material'])
            self.assertIsNotNone(material_record['packagingGroup'])
