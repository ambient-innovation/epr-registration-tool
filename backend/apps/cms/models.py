from wagtail import blocks
from wagtail.admin.panels import FieldPanel
from wagtail.api import APIField
from wagtail.fields import StreamField
from wagtail.images.blocks import ImageChooserBlock
from wagtail.models import Page

from cms.headless_mixin import CustomHeadlessMixin


class ImageBlock(blocks.StructBlock):
    alt_text = blocks.CharBlock()
    image = ImageChooserBlock(required=False)

    def get_api_representation(self, value, context=None):
        return {
            'alt_text': value['alt_text'],
            'image': {
                'url': value['image'].file.url,
                'width': value['image'].file.width,
                'height': value['image'].file.height,
            },
        }


class AbstractStandardPage(CustomHeadlessMixin, Page):
    class Meta:
        abstract = True

    body = StreamField(
        [
            ('paragraph', blocks.RichTextBlock(features=['h2', 'h3', 'bold', 'italic', 'ul', 'ol'])),
        ],
        use_json_field=True,
    )

    content_panels = Page.content_panels + [
        FieldPanel('body'),
    ]

    api_fields = [
        APIField('body'),
    ]


class HomePage(AbstractStandardPage):
    parent_page_types = ('wagtailcore.Page',)


class StandardPage(AbstractStandardPage):
    parent_page_types = ('cms.HomePage',)
    subpage_types = ()
