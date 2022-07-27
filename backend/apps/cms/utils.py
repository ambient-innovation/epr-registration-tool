import typing

from bs4 import BeautifulSoup
from wagtail.models import Page


def get_page_type(page) -> typing.Optional[str]:
    """
    Copied from:
    wagtail.api.v2.serializers.PageTypeField.to_representation

    Returns content type of page as string. Example: "cms.HomePage"
    """
    if page.specific_class is None:
        return None
    return page.specific_class._meta.app_label + "." + page.specific_class.__name__


def get_page_for_id(page_id) -> typing.Optional[Page]:
    return Page.objects.live().filter(id=page_id).specific().first()


def parse_internal_link(value):
    soup = BeautifulSoup(value, features='html.parser')

    for link in soup.findAll('a', {'id': True}):

        # remove "id" attribute from tag
        page_id = link.attrs.pop('id')

        page = get_page_for_id(page_id)

        if page:
            link['data-slug'] = page.slug
            link['data-pagetype'] = get_page_type(page)
        else:
            # remove link if page does not exist
            link.name = 'span'
            link.attrs = {}

    return str(soup)
