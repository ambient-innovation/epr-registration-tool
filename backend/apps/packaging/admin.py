from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from modeltranslation.admin import TranslationAdmin

from packaging.models import Material, MaterialPrice, PackagingGroup
from packaging.price_utils import get_material_latest_price


class MaterialPriceInline(admin.StackedInline):
    model = MaterialPrice
    extra = 0
    min_num = 1
    ordering = ('sort_key',)
    fields = (
        'start_year',
        'start_month',
        'price_per_kg',
    )


@admin.register(PackagingGroup)
class PackagingGroupAdmin(TranslationAdmin):
    list_display = ('name',)
    fields = ('name',)


@admin.register(Material)
class MaterialAdmin(TranslationAdmin):
    list_display = (
        'name',
        'current_price',
    )
    fields = ('name',)
    inlines = (MaterialPriceInline,)

    @admin.display(description=_('Current price (kg)'))
    def current_price(self, obj):
        material_price = get_material_latest_price(obj.id)
        return (
            f'{material_price.price_per_kg} ({material_price.start_month}.{material_price.start_year})'
            if material_price
            else 'n.a.'
        )
