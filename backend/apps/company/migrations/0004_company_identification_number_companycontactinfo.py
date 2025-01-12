# Generated by Django 4.0.4 on 2022-06-08 11:24

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models

from apps.company import validators


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('company', '0003_company_is_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='identification_number',
            field=models.CharField(
                blank=True,
                max_length=255,
                validators=[validators.validate_string_without_whitespaces],
                verbose_name='National identification number',
            ),
        ),
        migrations.CreateModel(
            name='CompanyContactInfo',
            fields=[
                (
                    'created_at',
                    models.DateTimeField(db_index=True, default=django.utils.timezone.now, verbose_name='Created at'),
                ),
                (
                    'lastmodified_at',
                    models.DateTimeField(
                        db_index=True, default=django.utils.timezone.now, verbose_name='Last modified at'
                    ),
                ),
                (
                    'related_company',
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        primary_key=True,
                        related_name='related_contact_info',
                        serialize=False,
                        to='company.company',
                    ),
                ),
                ('country', models.CharField(max_length=100, verbose_name='Country')),
                ('postal_code', models.CharField(blank=True, max_length=15, verbose_name='Postal code')),
                ('city', models.CharField(max_length=255, verbose_name='City')),
                ('street', models.CharField(max_length=255, verbose_name='Street')),
                ('street_number', models.CharField(blank=True, max_length=15, verbose_name='Street number')),
                ('phone_number', models.CharField(max_length=20, verbose_name='Phone number')),
                (
                    'additional_address_info',
                    models.TextField(blank=True, verbose_name='Additional address info'),
                ),
                (
                    'created_by',
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name='%(app_label)s_%(class)s_created',
                        to=settings.AUTH_USER_MODEL,
                        verbose_name='Created by',
                    ),
                ),
                (
                    'lastmodified_by',
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name='%(app_label)s_%(class)s_lastmodified',
                        to=settings.AUTH_USER_MODEL,
                        verbose_name='Last modified by',
                    ),
                ),
            ],
            options={
                'verbose_name': 'Company Contact Info',
                'verbose_name_plural': 'Company Contact Infos',
            },
        ),
    ]
