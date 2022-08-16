from django.contrib import admin
from taggit.models import Tag
from wagtail.documents.models import Document
from wagtail.images.models import Image

admin.site.unregister(Document)
admin.site.unregister(Image)
admin.site.unregister(Tag)
