import re

from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def validate_zip_code(value):
    if not re.search(r"^\d{5}$", value):
        raise ValidationError(
            _('%(value)s is not valid Postal code'),
            params={'value': value},
            code='invalid_zip_code',
        )


def validate_street_contains_number(value):
    if not any(character.isdigit() for character in value):
        raise ValidationError(
            _('%(value)s contains no house number'),
            params={'value': value},
            code='missing_house_number',
        )


def validate_string_without_whitespaces(value):
    if " " in value:
        raise ValidationError(
            _('%(value)s whitespaces are not allowed'),
            params={'value': value},
            code='whitespacesNotAllowed',
        )
