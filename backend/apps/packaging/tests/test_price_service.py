from django.test import TestCase

from model_bakery import baker

from packaging.price_service import PriceService


class PriceServiceTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.material_1 = baker.make('packaging.Material', name='PET')
        cls.material_2 = baker.make('packaging.Material', name='Metal cans')
        cls.material_price_1 = baker.make(
            'packaging.MaterialPrice', related_material=cls.material_1, start_year=2021, start_month=1, price_per_kg=5
        )
        cls.material_price_2 = baker.make(
            'packaging.MaterialPrice', related_material=cls.material_1, start_year=2021, start_month=6, price_per_kg=10
        )
        cls.material_price_3 = baker.make(
            'packaging.MaterialPrice', related_material=cls.material_1, start_year=2022, start_month=1, price_per_kg=20
        )
        cls.service = PriceService.get_instance()
        cls.service.initialize()

    def test_get_price_happy_path(self):

        self.assertEqual(
            self.material_price_1,
            self.service.get_price(material_id=self.material_1.id, year=2021, month=1),
        )
        self.assertEqual(
            self.material_price_1,
            self.service.get_price(material_id=self.material_1.id, year=2021, month=1),
        )
        self.assertEqual(
            self.material_price_1,
            self.service.get_price(material_id=self.material_1.id, year=2021, month=5),
        )
        self.assertEqual(
            self.material_price_2,
            self.service.get_price(material_id=self.material_1.id, year=2021, month=6),
        )
        self.assertEqual(
            self.material_price_3,
            self.service.get_price(material_id=self.material_1.id, year=3000, month=1),
        )

    def test_get_price_with_non_existing_material(self):
        self.assertEqual(None, self.service.get_price(material_id=0, year=2021, month=1))

    def test_get_price_with_material_without_any_prices(self):
        self.assertEqual(None, self.service.get_price(material_id=self.material_2.id, year=2021, month=1))

    def test_reset_prices(self):
        self.assertEqual(
            self.material_price_1,
            self.service.get_price(material_id=self.material_1.id, year=2021, month=2),
        )

        # add new price that changes the history
        new_price_1 = baker.make(
            'packaging.MaterialPrice', related_material=self.material_1, start_year=2021, start_month=2, price_per_kg=6
        )
        # add new price at last
        new_price_2 = baker.make(
            'packaging.MaterialPrice', related_material=self.material_1, start_year=2023, start_month=1, price_per_kg=25
        )

        self.service.reset_material(self.material_1.id)

        self.assertEqual(
            new_price_1,
            self.service.get_price(material_id=self.material_1.id, year=2021, month=2),
        )
        self.assertEqual(
            new_price_2,
            self.service.get_price(material_id=self.material_1.id, year=2024, month=1),
        )
