import datetime

from django.contrib import admin
from django.db.models import F
from django.utils.translation import gettext_lazy as _

from packaging.models import Material, MaterialPrice, PackagingGroup
from packaging.price_service import PriceService


@admin.register(PackagingGroup)
class PackagingGroupAdmin(admin.ModelAdmin):
    list_display = ('name',)
    fields = ('name',)


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'current_price',
    )
    fields = ('name',)

    @admin.display(description=_('Current price (kg)'))
    def current_price(self, obj):
        today = datetime.date.today()
        material_price = PriceService.get_instance().get_price(obj.id, year=today.year, month=today.month)
        return (
            f'{material_price.price_per_kg} ({material_price.start_month}.{material_price.start_year})'
            if material_price
            else 'n.a.'
        )


@admin.register(MaterialPrice)
class MaterialPriceAdmin(admin.ModelAdmin):
    list_display = (
        'material_name',
        'start_year',
        'start_month',
        'price_per_kg',
    )
    list_filter = ('related_material',)
    search_fields = ('related_material__name',)
    fields = (
        'related_material',
        'start_year',
        'start_month',
        'price_per_kg',
    )

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(material_name=F('related_material__name'))

    @admin.display(description='Material', ordering='material_name')
    def material_name(self, obj):
        return obj.material_name

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        # reset prices for material
        material_id = obj.related_material_id
        PriceService.get_instance().reset_material(material_id=material_id)

    def delete_model(self, request, obj):
        material_id = obj.related_material_id
        super().delete_model(request, obj)
        # reset prices for material
        PriceService.get_instance().reset_material(material_id=material_id)
