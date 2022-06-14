from datetime import datetime

from django.utils.timezone import make_aware

import time_machine
from model_bakery import baker

from common.tests.test_base import BaseApiTestCase


class PackagingReportQueriesTestCase(BaseApiTestCase):
    AUTO_CREATE_USERS = True
    ALWAYS_LOGIN_USER = True
    QUERY = """
        query packagingReportFeesEstimation (
            $year: Int!,
            $startMonth: Int!,
            $timeframe: TimeframeType!,
            $packagingRecords: [PackagingGroupInput!]!
        ) {
            packagingReportFeesEstimation (
                year: $year,
                startMonth: $startMonth,
                timeframe: $timeframe,
                packagingRecords: $packagingRecords
            )
        }
    """

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.packaging_group = baker.make_recipe('packaging.tests.packaging_group')
        cls.packaging_group_2 = baker.make_recipe('packaging.tests.packaging_group')
        cls.material = baker.make_recipe('packaging.tests.packaging_material')
        cls.material_2 = baker.make_recipe('packaging.tests.packaging_material')
        baker.make_recipe(
            'packaging.tests.packaging_material_price',
            start_year=2022,
            start_month=4,
            price_per_kg=6,
            related_material=cls.material,
        )
        baker.make_recipe(
            'packaging.tests.packaging_material_price',
            start_year=2022,
            start_month=5,
            price_per_kg=10,
            related_material=cls.material,
        )
        baker.make_recipe(
            'packaging.tests.packaging_material_price',
            start_year=2020,
            start_month=6,
            price_per_kg=15,
            related_material=cls.material_2,
        )

    @time_machine.travel(make_aware(datetime(year=2022, month=6, day=1)))
    def test_calculate_packaging_report_fees_starts_after_last_price_change(self):
        variables = {
            "year": 2022,
            "startMonth": 7,
            "timeframe": "THREE_MONTHS",
            "packagingRecords": [
                {
                    "packagingGroupId": self.packaging_group.id,
                    "materialRecords": [{"materialId": self.material.id, "quantity": 55}],
                },
                {
                    "packagingGroupId": self.packaging_group_2.id,
                    "materialRecords": [{"materialId": self.material_2.id, "quantity": 100}],
                },
            ],
        }
        data = self.query_and_load_data(self.QUERY, variables=variables)
        self.assertEqual('2050.00', data['packagingReportFeesEstimation'])

    @time_machine.travel(make_aware(datetime(year=2022, month=6, day=1)))
    def test_calculate_packaging_report_fees_starts_after_goes_over_price_change(self):
        variables = {
            "year": 2022,
            "startMonth": 4,
            "timeframe": "THREE_MONTHS",
            "packagingRecords": [
                {
                    "packagingGroupId": self.packaging_group.id,
                    "materialRecords": [{"materialId": self.material.id, "quantity": 55}],
                },
                {
                    "packagingGroupId": self.packaging_group_2.id,
                    "materialRecords": [{"materialId": self.material_2.id, "quantity": 100}],
                },
            ],
        }
        data = self.query_and_load_data(self.QUERY, variables=variables)
        self.assertEqual('1976.67', data['packagingReportFeesEstimation'])
