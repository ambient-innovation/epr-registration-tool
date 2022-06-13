from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def validate_string_without_whitespaces(value):
    if " " in value:
        raise ValidationError(
            _('%(value)s whitespaces are not allowed'),
            params={'value': value},
            code='whitespacesNotAllowed',
        )
