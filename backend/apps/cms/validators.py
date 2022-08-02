from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def validate_is_pdf(value):
    if value.content_type != 'application/pdf':
        raise ValidationError(
            _('Only PDF files are allowed.'),
            params={'value': value},
            code='onlyPdfAllowed',
        )
