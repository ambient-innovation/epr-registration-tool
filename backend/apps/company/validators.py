from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def validate_string_without_whitespaces(value):
    if " " in value:
        raise ValidationError(
            _('%(value)s whitespaces are not allowed'),
            params={'value': value},
            code='whitespacesNotAllowed',
        )


def validate_max_image_size(image):
    if image.size > settings.MAX_LOGO_FILE_SIZE:
        raise ValidationError(
            _('The maximum file size is 2MB'),
            params={'value': image},
            code='maximumFileSizeExceeded',
        )


def validate_allowed_image_formats(image):
    import imghdr

    allowed_extensions = settings.ALLOWED_IMAGE_EXTENSIONS
    file_extension = imghdr.what(image)
    if file_extension not in allowed_extensions:
        raise ValidationError(
            _("Not allowed file extension. Allowed extensions are: %(allowed_extensions)s."),
            params={'extension': file_extension, 'allowed_extensions': ", ".join(allowed_extensions)},
            code='invalidExtension',
        )


def validate_is_lower_case(value: str):
    if not value.islower():
        raise ValidationError(
            _('Value must be lower case'),
            params={'value': value},
            code='stringMustBeLowerCase',
        )
