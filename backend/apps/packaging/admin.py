from django import forms
from django.contrib import admin
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from modeltranslation.admin import TranslationAdmin

from packaging.models import Material, MaterialPrice, PackagingGroup
from packaging.price_utils import get_material_latest_price


class MaterialPriceForm(forms.ModelForm):
    YEAR_CHOICES = []
    now = timezone.now()
    current_year = now.year
    for r in range(current_year - 5, current_year + 5):
        YEAR_CHOICES.append((r, r))
    start_year = forms.CharField(
        max_length=4,
        widget=forms.Select(choices=YEAR_CHOICES),
    )


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
    form = MaterialPriceForm


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
