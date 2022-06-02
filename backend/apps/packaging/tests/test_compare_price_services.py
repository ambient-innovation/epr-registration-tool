import time
from sys import getsizeof

from django.test import TestCase

from model_bakery import baker

from packaging.price_service import PriceService
from packaging.price_utils import get_price


class PriceServiceTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.materials = baker.make('packaging.Material', name='PET', _quantity=100)
        cls.material_prices = []
        for material in cls.materials:
            material_price_1 = baker.make(
                'packaging.MaterialPrice', related_material=material, start_year=2001, start_month=1, price_per_kg=5
            )
            material_price_2 = baker.make(
                'packaging.MaterialPrice', related_material=material, start_year=2100, start_month=1, price_per_kg=10
            )
            cls.material_prices.append((material_price_1, material_price_2))

        print(
            f'Testing with {len(cls.materials)} materials '
            f'and prices across {cls.material_prices[0][1].start_year - cls.material_prices[0][0].start_year} years'
        )

        start = time.time()
        cls.service = PriceService.get_instance()
        cls.service.initialize()
        end = time.time()
        print(f'PriceService initialization took {end - start}s')
        print(f'Dictionary has size of {getsizeof(cls.service.prices_history)} bytes')

    def test_get_price_happy_path(self):
        self.assertEqual(
            self.material_prices[0][0],
            self.service.get_price(material_id=self.materials[0].id, year=2021, month=1),
        )

    def test_measure_price_service(self):
        year = 2001
        month = 1
        material_id = self.materials[0].id

        computations = 0
        start = time.time()
        while year < 2100:
            self.service.get_price(material_id=material_id, year=year, month=month),
            computations += 1
            if month < 12:
                month += 1
            else:
                year += 1
                month = 1

        end = time.time()

        print(f'PriceService took {end - start}s to compute {computations} prices')

    def test_measure_get_price(self):
        year = 2001
        month = 1
        material_id = self.materials[0].id

        computations = 0
        start = time.time()
        while year < 2100:
            get_price(material_id=material_id, year=year, month=month),
            computations += 1
            if month < 12:
                month += 1
            else:
                year += 1
                month = 1

        end = time.time()

        print(f'get_price() took {end - start}s to compute {computations} prices')

    # def test_get_price_happy_path(self):
    #
    #     self.assertEqual(
    #         self.material_price_1,
    #         self.service.get_price(material_id=self.material_1.id, year=2021, month=1),
    #     )
    #     self.assertEqual(
    #         self.material_price_1,
    #         self.service.get_price(material_id=self.material_1.id, year=2021, month=1),
    #     )
    #     self.assertEqual(
    #         self.material_price_1,
    #         self.service.get_price(material_id=self.material_1.id, year=2021, month=5),
    #     )
    #     self.assertEqual(
    #         self.material_price_2,
    #         self.service.get_price(material_id=self.material_1.id, year=2021, month=6),
    #     )
    #     self.assertEqual(
    #         self.material_price_3,
    #         self.service.get_price(material_id=self.material_1.id, year=3000, month=1),
    #     )
    #
    # def test_get_price_with_non_existing_material(self):
    #     self.assertEqual(None, self.service.get_price(material_id=0, year=2021, month=1))
    #
    # def test_get_price_with_material_without_any_prices(self):
    #     self.assertEqual(None, self.service.get_price(material_id=self.material_2.id, year=2021, month=1))
    #
    # def test_reset_prices(self):
    #     self.assertEqual(
    #         self.material_price_1,
    #         self.service.get_price(material_id=self.material_1.id, year=2021, month=2),
    #     )
    #
    #     # add new price that changes the history
    #     new_price_1 = baker.make(
    #         'packaging.MaterialPrice', related_material=self.material_1, start_year=2021, start_month=2, price_per_kg=6
    #     )
    #     # add new price at last
    #     new_price_2 = baker.make(
    #         'packaging.MaterialPrice', related_material=self.material_1, start_year=2023, start_month=1, price_per_kg=25
    #     )
    #
    #     self.service.reset_material(self.material_1.id)
    #
    #     self.assertEqual(
    #         new_price_1,
    #         self.service.get_price(material_id=self.material_1.id, year=2021, month=2),
    #     )
    #     self.assertEqual(
    #         new_price_2,
    #         self.service.get_price(material_id=self.material_1.id, year=2024, month=1),
    #     )
