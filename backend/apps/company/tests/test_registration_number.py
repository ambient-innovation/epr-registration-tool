from unittest.mock import patch

from model_bakery import baker

from apps.common.tests.test_base import BaseTestCase
from apps.company.utils import generate_registration_number, generate_unique_registration_number


class RegistrationNumberTestCase(BaseTestCase):
    def test_generate_registration_number(self):
        registration_number = generate_registration_number('en')
        part_1 = registration_number[:2]
        part_2 = registration_number[2:]
        self.assertEqual(len(registration_number), 12)
        self.assertEqual('EN', part_1)
        self.assertTrue(part_2.isnumeric())

    def test_generate_registration_number_with_invalid_country_code(self):
        with self.assertRaises(AssertionError):
            generate_registration_number('A')
        with self.assertRaises(AssertionError):
            generate_registration_number('11')
        with self.assertRaises(AssertionError):
            generate_registration_number('AAA')
        with self.assertRaises(AssertionError):
            generate_registration_number(None)

    @patch('apps.company.utils.generate_registration_number')
    def test_generate_unique_registration_number(self, mock_randint):
        baker.make_recipe('apps.company.tests.company', registration_number='foo')
        company = baker.prepare_recipe('apps.company.tests.company')
        mock_randint.side_effect = ['foo', 'foo', 'bar']
        generate_unique_registration_number(company)
        self.assertEqual(3, mock_randint.call_count)

    @patch('apps.company.utils.generate_registration_number', return_value='foo')
    def test_generate_unique_registration_number_fails_after_10_attempts(self, mock_randint):
        baker.make_recipe('apps.company.tests.company', registration_number='foo')
        company = baker.prepare_recipe('apps.company.tests.company')
        with self.assertRaises(Exception) as context:
            generate_unique_registration_number(company)
        self.assertEqual(
            'Failed to generate unique registration number after 10 attempts',
            str(context.exception),
        )
