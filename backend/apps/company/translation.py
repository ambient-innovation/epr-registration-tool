from modeltranslation.decorators import register
from modeltranslation.translator import TranslationOptions

from company.models import Sector, Subsector


@register(Sector)
class SectorTranslationOptions(TranslationOptions):
    fields = ('name',)
    required_languages = ('en', 'ar')


@register(Subsector)
class SubsectorTranslationOptions(TranslationOptions):
    fields = ('name',)
    required_languages = ('en', 'ar')
