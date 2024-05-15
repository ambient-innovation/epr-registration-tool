from modeltranslation.decorators import register
from modeltranslation.translator import TranslationOptions

from apps.packaging.models import Material, PackagingGroup


@register(PackagingGroup)
class PackagingGroupTranslationOptions(TranslationOptions):
    fields = ('name',)
    required_languages = ('en', 'ar')


@register(Material)
class MaterialTranslationOptions(TranslationOptions):
    fields = ('name',)
    required_languages = ('en', 'ar')
