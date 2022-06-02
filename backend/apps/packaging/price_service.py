from __future__ import annotations

from typing import Optional, Tuple

from packaging.models import Material, MaterialPrice


class PriceService:
    prices_history = {}
    latest_prices = {}
    first_prices = {}

    instance = None

    @classmethod
    def get_instance(cls) -> PriceService:
        if not cls.instance:
            cls.instance = PriceService()
        return cls.instance

    def initialize(self):
        material_id_list = Material.objects.values_list('id', flat=True)
        for material_id in material_id_list:
            self.reset_material(material_id)

    def get_price(self, material_id: int, year: int, month: int) -> Optional[MaterialPrice]:
        material_prices_map = self.prices_history.get(material_id, None)
        if material_prices_map is None:
            return None
        return material_prices_map.get((year, month), self.latest_prices.get(material_id, None))

    def reset_material(self, material_id: int) -> None:
        material_prices_map, first_item, last_item = self._build_material_prices_map(material_id)
        self.prices_history[material_id] = material_prices_map
        self.first_prices[material_id] = first_item
        self.latest_prices[material_id] = last_item

    def _build_material_prices_map(self, material_id) -> Tuple[dict, Optional[MaterialPrice], Optional[MaterialPrice]]:
        material_prices_map = {}
        material_prices_list = list(
            MaterialPrice.objects.filter(related_material_id=material_id).order_by('start_year', 'start_month')
        )

        if len(material_prices_list) == 0:
            return material_prices_map, None, None

        first_item = material_prices_list[0]
        current_year = first_item.start_year
        current_month = first_item.start_month
        last_index = len(material_prices_list) - 1
        last_item = material_prices_list[last_index]

        for idx, item in enumerate(material_prices_list):

            if idx == last_index:
                break

            next_item = material_prices_list[idx + 1]

            while next_item and (current_year < next_item.start_year or current_month < next_item.start_month):
                material_prices_map[(current_year, current_month)] = item
                if current_month < 12:
                    current_month += 1
                else:
                    current_month = 1
                    current_year += 1

        return material_prices_map, first_item, last_item
