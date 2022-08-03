from django.db import models
from django.utils.translation import gettext_lazy as _

from wagtail import blocks
from wagtail.documents.blocks import DocumentChooserBlock
from wagtail.images.blocks import ImageChooserBlock

from cms.image_utils import get_image_placeholder
from cms.utils import get_page_for_id, get_page_type, parse_internal_link
from cms.validators import validate_is_pdf

DEFAULT_RICH_TEXT_FEATURES = ['h3', 'bold', 'italic', 'ul', 'ol', 'link']


class BackgroundChoices(models.TextChoices):
    DEFAULT = 'default', _('White')
    SHADED = 'shaded', _('Light gray')


class CustomRichTextBlock(blocks.RichTextBlock):
    def get_api_representation(self, value, context=None):
        data = super().get_api_representation(value, context)
        return parse_internal_link(data)


class ImageBlock(blocks.StructBlock):
    alt_text = blocks.CharBlock()
    image = ImageChooserBlock(required=False)
    caption = blocks.CharBlock(required=False)

    def get_api_representation(self, value, context=None):
        image = value['image']

        return {
            'alt_text': value['alt_text'],
            'url': image.file.url,
            'width': image.file.width,
            'height': image.file.height,
            'caption': value['caption'],
            'placeholder': get_image_placeholder(image),
        }


class FullWidthImageBlock(blocks.StructBlock):
    image = ImageBlock()
    heading = blocks.CharBlock(required=False)
    background = blocks.ChoiceBlock(choices=BackgroundChoices.choices, default=BackgroundChoices.DEFAULT)

    class Meta:
        label = _('Full width image')
        icon = 'image'


class CtaBlock(blocks.StructBlock):
    class Meta:
        label = _('Call to action')

    label = blocks.CharBlock(required=False)
    internal_page = blocks.PageChooserBlock(required=False)
    external_link = blocks.URLBlock(required=False)

    def get_api_representation(self, value, context=None):
        data = super().get_api_representation(value, context=context)
        if not data['label']:
            return None

        if data['internal_page']:
            # replace page id by link attributes
            page_id = data['internal_page']
            page = get_page_for_id(page_id)
            data['internal_page'] = (
                {
                    'slug': page.slug,
                    'type': get_page_type(page),
                }
                if page
                else None
            )

        if not (data['internal_page'] or data['external_link']):
            return None

        return data


class BaseTextBlock(blocks.StructBlock):
    heading = blocks.CharBlock()
    body = CustomRichTextBlock(features=DEFAULT_RICH_TEXT_FEATURES)
    cta = CtaBlock()


class TextBlock(BaseTextBlock):
    class Meta:
        icon = 'pilcrow'
        label = _('Text')

    class OrientationChoices(models.TextChoices):
        LEFT = 'left', _('Left')
        CENTERED = 'center', _('Centered')

    orientation = blocks.ChoiceBlock(choices=OrientationChoices.choices, default=OrientationChoices.LEFT)
    background = blocks.ChoiceBlock(choices=BackgroundChoices.choices, default=BackgroundChoices.DEFAULT)


class ImageWithTextBlock(blocks.StructBlock):
    class Meta:
        label = _('Image with text')
        icon = 'image'

    class OrientationChoices(models.TextChoices):
        TEXT_FIRST = 'textFirst', _('Text first')
        IMAGE_FIRST = 'imageFirst', _('Image first')
        FULL_WIDTH_IMAGE = 'fullWidthImage', _('Full width image')

    image = ImageBlock()
    text = BaseTextBlock()

    orientation = blocks.ChoiceBlock(choices=OrientationChoices.choices, default=OrientationChoices.TEXT_FIRST)
    background = blocks.ChoiceBlock(choices=BackgroundChoices.choices, default=BackgroundChoices.DEFAULT)


class PdfDocumentBlock(DocumentChooserBlock):
    def get_api_representation(self, value, context=None):
        return {
            'title': value.title,
            'url': value.file.url if value.file else '',
            'fileSize': value.file_size,
        }


class PdfDownloadBlock(blocks.StructBlock):
    text = BaseTextBlock()
    files = blocks.ListBlock(
        child_block=PdfDocumentBlock(validators=(validate_is_pdf,), help_text=_('Please select a PDF file'))
    )

    class Meta:
        label = _('PDF file links with text')


DEFAULT_BLOCKS = [
    ('text', TextBlock()),
    ('fullWidthImage', FullWidthImageBlock()),
    ('imageWithText', ImageWithTextBlock()),
    ('pdfDownload', PdfDownloadBlock()),
]
