from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def validate_greater_than_zero(value):
    if value <= 0:
        raise ValidationError(
            _('%(value)s should be bigger than zero'),
            params={'value': value},
        )
