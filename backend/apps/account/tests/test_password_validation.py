from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.test import TestCase


class PasswordValidationTestCase(TestCase):
    def assert_validation_error(self, password: str, message: str):
        with self.assertRaises(ValidationError) as context:
            validate_password(password)
        exception = context.exception.error_list[0]
        self.assertEqual(message, exception.code)

    def test_valid_password(self):
        validate_password('Pass123$')

    def test_password_validators(self):
        self.assert_validation_error('Pass1234', 'passwordMustHaveSpecialCharacter')
        self.assert_validation_error('pass123$', 'passwordMustHaveUppercase')
        self.assert_validation_error('PASS123$', 'passwordMustHaveLowercase')
        self.assert_validation_error('Pas123$', 'passwordTooShort')
        self.assert_validation_error('Pass$$$$', 'passwordMustHaveOneNumber')
