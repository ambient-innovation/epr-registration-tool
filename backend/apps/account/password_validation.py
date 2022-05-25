import re

from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


class MinimumLengthValidator:
    @staticmethod
    def validate(password, user=None):
        if len(password.strip()) < 8:
            raise ValidationError(
                _("The password must contain at least 8 characters"),
                code='passwordTooShort',
            )

    @staticmethod
    def get_help_text():
        return _("The password must contain at least 8 characters.")


class ContainsUppercaseLetterValidator:
    @staticmethod
    def validate(password, user=None):
        if not re.search(r'[A-Z]', password):
            raise ValidationError(
                _("The password must contain at least one uppercase letter"),
                code='passwordMustHaveUppercase',
            )

    @staticmethod
    def get_help_text():
        return _("The password must contain at least one uppercase letter.")


class ContainsLowercaseLetterValidator:
    @staticmethod
    def validate(password, user=None):
        if not re.search(r'[a-z]', password):
            raise ValidationError(
                _("The password must contain at least one lowercase letter"),
                code='passwordMustHaveLowercase',
            )

    @staticmethod
    def get_help_text():
        return _("The password must contain at least one lowercase letter.")


class ContainsNumberValidator:
    @staticmethod
    def validate(password, user=None):
        if not re.search(r'\d', password):
            raise ValidationError(
                _("The password must contain at least one number"),
                code='passwordMustHaveOneNumber',
            )

    @staticmethod
    def get_help_text():
        return _("The password must contain at least one number.")


class ContainsSpecialCharacterValidator:
    @staticmethod
    def validate(password, user=None):
        if not re.search(r'[`!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>/?~]', password):
            raise ValidationError(
                _("The password must contain at least one special character, e.g., ! @ # ? ]"),
                code='passwordMustHaveSpecialCharacter',
            )

    @staticmethod
    def get_help_text():
        return _("The password must contain at least one special character, e.g., ! @ # ? ].")
