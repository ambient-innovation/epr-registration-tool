# Generated by Django 4.0.4 on 2022-06-15 11:59

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('packaging', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='materialprice',
            name='price_per_kg',
            field=models.FloatField(help_text='price in JOD per Kg', verbose_name='Price'),
        ),
    ]
