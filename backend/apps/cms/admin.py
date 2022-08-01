from django.contrib import admin

from wagtail.documents.models import Document
from wagtail.images.models import Image

admin.site.unregister(Document)
admin.site.unregister(Image)
