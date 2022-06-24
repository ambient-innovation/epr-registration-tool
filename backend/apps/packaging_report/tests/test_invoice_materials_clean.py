from datetime import datetime
from decimal import Decimal

import time_machine
from django.db.models import Prefetch
from django.utils.timezone import make_aware
from model_bakery import baker

from common.tests.test_base import BaseTestCase
from packaging_report.invoice import InvoiceService
from packaging_report.invoice_file import InvoicePdf
from packaging_report.models import PackagingReport, TimeframeType


@time_machine.travel(make_aware(datetime(year=2023, month=1, day=1)))
class MaterialGroupInvoiceServiceTestCase(BaseTestCase):
    AUTO_CREATE_USERS = True

    @staticmethod
    def make_material_price(material, year, month, price):
        baker.make(
            'packaging.MaterialPrice', related_material=material, start_year=year, start_month=month, price_per_kg=price
        )

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()

        cls.company = cls.create_and_assign_company(cls.user)
        cls.packaging_group_1, cls.packaging_group_2 = baker.make_recipe('packaging.tests.packaging_group', _quantity=2)

        cls.material_1 = baker.make('packaging.Material', name='PET')
        cls.material_2 = baker.make('packaging.Material', name='Metal cans')
        cls.material_3 = baker.make('packaging.Material', name='Plastic')
        # material No. 1 prices
        cls.make_material_price(cls.material_1, 2021, 1, 10)
        cls.make_material_price(cls.material_1, 2021, 3, 20)
        cls.make_material_price(cls.material_1, 2021, 6, 30)
        cls.make_material_price(cls.material_1, 2022, 3, 20)
        cls.make_material_price(cls.material_1, 2022, 6, 50)
        cls.make_material_price(cls.material_1, 2023, 6, 55)
        # material No. 2 prices
        cls.make_material_price(cls.material_2, 2022, 1, 100)
        cls.make_material_price(cls.material_2, 2022, 6, 150)
        cls.make_material_price(cls.material_2, 2022, 12, 175)
        # # material No. 2 prices
        cls.make_material_price(cls.material_3, 2022, 1, 10)
        cls.make_material_price(cls.material_3, 2022, 2, 19)
        cls.make_material_price(cls.material_3, 2022, 3, 19.4)
        cls.make_material_price(cls.material_3, 2022, 4, 19.5)
        cls.make_material_price(cls.material_3, 2022, 5, 19.6)
        cls.make_material_price(cls.material_3, 2022, 6, 19.7)
        cls.make_material_price(cls.material_3, 2022, 7, 19.8)
        cls.make_material_price(cls.material_3, 2022, 9, 19.9)

        cls.packaging_report = baker.make_recipe(
            'packaging_report.tests.packaging_report',
            related_company=cls.company,
            timeframe=TimeframeType.TWELVE_MONTHS,
            start_month=1,
            year=2022,
        )
        cls.final_submission = baker.make(
            'packaging_report.FinalSubmission', related_report=cls.packaging_report, fees=1594583.33
        )
        cls.material_record_1 = baker.make(
            'packaging_report.MaterialRecord',
            related_final_submission=cls.final_submission,
            related_packaging_material=cls.material_1,
            related_packaging_group=cls.packaging_group_1,
            quantity=500,
        )
        cls.material_record_1 = baker.make(
            'packaging_report.MaterialRecord',
            related_final_submission=cls.final_submission,
            related_packaging_material=cls.material_2,
            related_packaging_group=cls.packaging_group_2,
            quantity=12000,
        )
        cls.material_record_1 = baker.make(
            'packaging_report.MaterialRecord',
            related_final_submission=cls.final_submission,
            related_packaging_material=cls.material_3,
            related_packaging_group=cls.packaging_group_2,
            quantity=1000,
        )

    def test_clean_material_records_for_invoice_one_month_report(self):
        packaging_report = baker.make_recipe(
            'packaging_report.tests.packaging_report',
            related_company=self.company,
            timeframe=TimeframeType.MONTH,
            start_month=1,
            year=2022,
        )
        final_submission = baker.make('packaging_report.FinalSubmission', related_report=packaging_report, fees=360)
        baker.make(
            'packaging_report.MaterialRecord',
            related_final_submission=final_submission,
            related_packaging_material=self.material_1,
            related_packaging_group=self.packaging_group_1,
            quantity=12,
        )
        packaging_report = (
            PackagingReport.objects.filter(pk=packaging_report.pk)
            .prefetch_related(
                Prefetch('related_final_submission', to_attr='final_submission'),
                Prefetch('final_submission__material_records_queryset', to_attr='material_records'),
                Prefetch(
                    'final_submission__material_records__related_packaging_material', to_attr='packaging_material'
                ),
                Prefetch('final_submission__material_records__related_packaging_group', to_attr='packaging_group'),
            )
            .first()
        )
        invoice_service = InvoiceService(
            packaging_report.timeframe,
            packaging_report.year,
            packaging_report.start_month,
            packaging_report.final_submission,
        )

        result = invoice_service.clean_material_records()
        total_fees = invoice_service.get_total_fees()
        self.assertEqual(12.0, result[0]['quantity'])
        self.assertEqual(360.00, result[0]['total'])
        self.assertEqual(1, len(result[0]['frames']))
        self.assertEqual(360.00, total_fees)
        self.assertEqual('01.01.2022', result[0]['frames'][0]['from'])
        self.assertEqual('31.01.2022', result[0]['frames'][0]['to'])
        self.assertEqual(Decimal('360.00'), result[0]['frames'][0]['total'])
        self.assertEqual(Decimal('12.00'), result[0]['frames'][0]['quantity'])
        self.assertEqual(30, result[0]['frames'][0]['fee_per_unit'])

    def test_clean_material_records_for_invoice_last_month_report(self):
        packaging_report = baker.make_recipe(
            'packaging_report.tests.packaging_report',
            related_company=self.company,
            timeframe=TimeframeType.MONTH,
            start_month=12,
            year=2022,
        )
        final_submission = baker.make('packaging_report.FinalSubmission', related_report=packaging_report, fees=600)
        baker.make(
            'packaging_report.MaterialRecord',
            related_final_submission=final_submission,
            related_packaging_material=self.material_1,
            related_packaging_group=self.packaging_group_1,
            quantity=12,
        )
        packaging_report = (
            PackagingReport.objects.filter(pk=packaging_report.pk)
            .prefetch_related(
                Prefetch('related_final_submission', to_attr='final_submission'),
                Prefetch('final_submission__material_records_queryset', to_attr='material_records'),
                Prefetch(
                    'final_submission__material_records__related_packaging_material', to_attr='packaging_material'
                ),
                Prefetch('final_submission__material_records__related_packaging_group', to_attr='packaging_group'),
            )
            .first()
        )
        invoice_service = InvoiceService(
            packaging_report.timeframe,
            packaging_report.year,
            packaging_report.start_month,
            packaging_report.final_submission,
        )

        result = invoice_service.clean_material_records()
        total_fees = invoice_service.get_total_fees()
        self.assertEqual(12.0, result[0]['quantity'])
        self.assertEqual(Decimal('600.00'), result[0]['total'])
        self.assertEqual(1, len(result[0]['frames']))
        self.assertEqual(600, total_fees)
        self.assertEqual('01.12.2022', result[0]['frames'][0]['from'])
        self.assertEqual('31.12.2022', result[0]['frames'][0]['to'])
        self.assertEqual(Decimal('600.00'), result[0]['frames'][0]['total'])
        self.assertEqual(Decimal('12.00'), result[0]['frames'][0]['quantity'])
        self.assertEqual(50, result[0]['frames'][0]['fee_per_unit'])

    def test_clean_material_records_for_invoice_three_months_report(self):
        packaging_report = baker.make_recipe(
            'packaging_report.tests.packaging_report',
            related_company=self.company,
            timeframe=TimeframeType.THREE_MONTHS,
            start_month=2,
            year=2022,
        )
        final_submission = baker.make('packaging_report.FinalSubmission', related_report=packaging_report, fees=600)
        baker.make(
            'packaging_report.MaterialRecord',
            related_final_submission=final_submission,
            related_packaging_material=self.material_1,
            related_packaging_group=self.packaging_group_1,
            quantity=3000,
        )
        packaging_report = (
            PackagingReport.objects.filter(pk=packaging_report.pk)
            .prefetch_related(
                Prefetch('related_final_submission', to_attr='final_submission'),
                Prefetch('final_submission__material_records_queryset', to_attr='material_records'),
                Prefetch(
                    'final_submission__material_records__related_packaging_material', to_attr='packaging_material'
                ),
                Prefetch('final_submission__material_records__related_packaging_group', to_attr='packaging_group'),
            )
            .first()
        )
        invoice_service = InvoiceService(
            packaging_report.timeframe,
            packaging_report.year,
            packaging_report.start_month,
            packaging_report.final_submission,
        )

        result = invoice_service.clean_material_records()
        total_fees = invoice_service.get_total_fees()
        self.assertEqual(600, total_fees)
        self.assertEqual(3000, result[0]['quantity'])
        self.assertEqual(Decimal('70000.00'), result[0]['total'])
        self.assertEqual(2, len(result[0]['frames']))
        self.assertEqual('01.02.2022', result[0]['frames'][0]['from'])
        self.assertEqual('28.02.2022', result[0]['frames'][0]['to'])
        self.assertEqual(Decimal('30000.00'), result[0]['frames'][0]['total'])
        self.assertEqual(Decimal('1000.00'), result[0]['frames'][0]['quantity'])
        self.assertEqual(30, result[0]['frames'][0]['fee_per_unit'])

        self.assertEqual('01.03.2022', result[0]['frames'][1]['from'])
        self.assertEqual('30.04.2022', result[0]['frames'][1]['to'])
        self.assertEqual(Decimal('40000.00'), result[0]['frames'][1]['total'])
        self.assertEqual(Decimal('2000.00'), result[0]['frames'][1]['quantity'])
        self.assertEqual(20, result[0]['frames'][1]['fee_per_unit'])

    def test_clean_material_records_for_invoice(self):
        packaging_report = (
            PackagingReport.objects.filter(pk=self.packaging_report.pk)
            .prefetch_related(
                Prefetch('related_final_submission', to_attr='final_submission'),
                Prefetch('final_submission__material_records_queryset', to_attr='material_records'),
                Prefetch(
                    'final_submission__material_records__related_packaging_material', to_attr='packaging_material'
                ),
                Prefetch('final_submission__material_records__related_packaging_group', to_attr='packaging_group'),
            )
            .first()
        )
        with self.assertNumQueries(36):
            invoice_service = InvoiceService(
                packaging_report.timeframe,
                packaging_report.year,
                packaging_report.start_month,
                packaging_report.final_submission,
            )
            result = invoice_service.clean_material_records()
            total_fees = invoice_service.get_total_fees()
        expected_result = [
            {
                'material_name': 'PET',
                'packaging_name': 'GROUP_1',
                'quantity': 500.0,
                'total': Decimal('19583.33'),
                'frames': [
                    {
                        'from': '01.01.2022',
                        'to': '28.02.2022',
                        'fee_per_unit': 30,
                        'quantity': Decimal('83.33'),
                        'total': Decimal('2500.00'),
                    },
                    {
                        'from': '01.03.2022',
                        'to': '31.05.2022',
                        'fee_per_unit': 20,
                        'quantity': Decimal('125.00'),
                        'total': Decimal('2500.00'),
                    },
                    {
                        'from': '01.06.2022',
                        'to': '31.12.2022',
                        'fee_per_unit': 50,
                        'quantity': Decimal('291.67'),
                        'total': Decimal('14583.33'),
                    },
                ],
            },
            {
                'material_name': 'Metal cans',
                'packaging_name': 'GROUP_2',
                'quantity': 12000.0,
                'total': Decimal('1575000.00'),
                'frames': [
                    {
                        'from': '01.01.2022',
                        'to': '31.05.2022',
                        'fee_per_unit': 100,
                        'quantity': Decimal('5000.00'),
                        'total': Decimal('500000.00'),
                    },
                    {
                        'from': '01.06.2022',
                        'to': '30.11.2022',
                        'fee_per_unit': 150,
                        'quantity': Decimal('6000.00'),
                        'total': Decimal('900000.00'),
                    },
                    {
                        'from': '01.12.2022',
                        'to': '31.12.2022',
                        'fee_per_unit': 175,
                        'quantity': Decimal('1000.00'),
                        'total': Decimal('175000.00'),
                    },
                ],
            },
        ]
        # material record frame #1
        self.assertEqual(1594583.33, total_fees)
        self.assertEqual(expected_result[0]['quantity'], result[0]['quantity'])
        self.assertEqual(expected_result[0]['material_name'], result[0]['material_name'])
        self.assertEqual(expected_result[0]['packaging_name'], result[0]['packaging_name'])
        self.assertEqual(expected_result[0]['total'], result[0]['total'])
        self.assertEqual(3, len(result[0]['frames']))
        for i in range(len(result[0]['frames'])):
            self.assertEqual(expected_result[0]['frames'][i]['from'], result[0]['frames'][i]['from'])
            self.assertEqual(expected_result[0]['frames'][i]['to'], result[0]['frames'][i]['to'])
            self.assertEqual(expected_result[0]['frames'][i]['total'], result[0]['frames'][i]['total'])
            self.assertEqual(expected_result[0]['frames'][i]['quantity'], result[0]['frames'][i]['quantity'])
            self.assertEqual(expected_result[0]['frames'][i]['fee_per_unit'], result[0]['frames'][i]['fee_per_unit'])
        # material record frame #2
        self.assertEqual(expected_result[1]['quantity'], result[1]['quantity'])
        self.assertEqual(expected_result[1]['material_name'], result[1]['material_name'])
        self.assertEqual(expected_result[1]['packaging_name'], result[1]['packaging_name'])
        self.assertEqual(expected_result[1]['total'], result[1]['total'])
        self.assertEqual(3, len(result[1]['frames']))
        for i in range(len(result[1]['frames'])):
            self.assertEqual(expected_result[1]['frames'][i]['from'], result[1]['frames'][i]['from'])
            self.assertEqual(expected_result[1]['frames'][i]['to'], result[1]['frames'][i]['to'])
            self.assertEqual(expected_result[1]['frames'][i]['total'], result[1]['frames'][i]['total'])
            self.assertEqual(expected_result[1]['frames'][i]['quantity'], result[1]['frames'][i]['quantity'])
            self.assertEqual(expected_result[1]['frames'][i]['fee_per_unit'], result[1]['frames'][i]['fee_per_unit'])

    def test_create_invoice_file_not_throwing_errors(self):
        file = InvoicePdf(self.packaging_report.id, self.user.id).generate_pdf()
        self.packaging_report.invoice_file = file
        self.packaging_report.save()
        self.assertIsNotNone(self.packaging_report.invoice_file)
