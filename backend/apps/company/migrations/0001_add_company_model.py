# Generated by Django 4.0.4 on 2022-05-30 12:08

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                (
                    'created_at',
                    models.DateTimeField(db_index=True, default=django.utils.timezone.now, verbose_name='Created at'),
                ),
                ('name', models.CharField(max_length=255, verbose_name='Name')),
                (
                    'distributor_type',
                    models.CharField(
                        choices=[('IMPORTER', 'Importer'), ('LOCAL_PRODUCER', 'Local producer')],
                        max_length=20,
                        verbose_name='Distributor Type',
                    ),
                ),
            ],
            options={
                'verbose_name': 'Company',
                'verbose_name_plural': 'Companies',
            },
        ),
    ]
