from wagtail.admin.panels import FieldPanel
from wagtail.api import APIField
from wagtail.fields import StreamField
from wagtail.models import Page

from cms.blocks import DEFAULT_BLOCKS
from cms.headless_mixin import CustomHeadlessMixin


class AbstractStandardPage(CustomHeadlessMixin, Page):
    class Meta:
        abstract = True

    body = StreamField(DEFAULT_BLOCKS, blank=True, use_json_field=True)

    content_panels = Page.content_panels + [
        FieldPanel('body'),
    ]

    api_fields = [
        APIField('body'),
    ]


class HomePage(AbstractStandardPage):
    max_count = 2
    parent_page_types = ('wagtailcore.Page',)


class StandardPage(AbstractStandardPage):
    parent_page_types = ('cms.HomePage',)
    subpage_types = ()
