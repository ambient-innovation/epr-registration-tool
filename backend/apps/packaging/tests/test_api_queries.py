from model_bakery import baker

from apps.common.tests.test_base import BaseApiTestCase


class PackagingBaseDataTestCase(BaseApiTestCase):
    PACKAGING_GROUPS_QUERY = """
          {
            packagingGroups {
              id
              name
            }
          }
    """

    PACKAGING_MATERIALS_QUERY = """
          {
            packagingMaterials {
              id
              name
            }
          }
    """

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        baker.make_recipe('apps.packaging.tests.packaging_group')
        baker.make_recipe('apps.packaging.tests.packaging_group')
        cls.packaging_material = baker.make_recipe('apps.packaging.tests.packaging_material')
        baker.make_recipe('apps.packaging.tests.packaging_material_price', related_material=cls.packaging_material)
        baker.make_recipe(
            'apps.packaging.tests.packaging_material_price',
            start_year=2023,
            start_month=6,
            price_per_kg=6,
            related_material=cls.packaging_material,
        )

    def test_get_materials_api(self):
        content = self.query_and_load_data(self.PACKAGING_MATERIALS_QUERY)
        self.assertIsNotNone(content['packagingMaterials'])
        self.assertEqual(1, len(content['packagingMaterials']))
        self.assertEqual("MATERIAL_1", content['packagingMaterials'][0]['name'])

    def test_get_materials_api_sending_accepted_language_return_correct_name(self):
        headers = {'HTTP_ACCEPT_LANGUAGE': 'ar'}

        self.packaging_material.name_ar = 'ARABIC_MATERIAL_1'
        self.packaging_material.save()

        content = self.query_and_load_data(self.PACKAGING_MATERIALS_QUERY, headers=headers)
        self.assertIsNotNone(content['packagingMaterials'])
        self.assertEqual(1, len(content['packagingMaterials']))
        self.assertEqual('ARABIC_MATERIAL_1', content['packagingMaterials'][0]['name'])

    def test_get_packaging_groups_api(self):
        content = self.query_and_load_data(self.PACKAGING_GROUPS_QUERY)
        self.assertIsNotNone(content['packagingGroups'])
        self.assertEqual(2, len(content['packagingGroups']))
        self.assertEqual("GROUP_1", content['packagingGroups'][0]['name'])
