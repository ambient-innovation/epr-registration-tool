# Generated by Django 4.0.4 on 2022-05-17 16:14

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0002_add_sector_subsector_translation'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subsector',
            name='related_sector',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='subsectors_queryset',
                to='company.sector',
                verbose_name='Sector',
            ),
        ),
    ]
