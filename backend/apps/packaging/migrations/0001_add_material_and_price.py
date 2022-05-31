# Generated by Django 4.0.4 on 2022-05-31 19:39

import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Material',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
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
                ('name', models.CharField(max_length=255, verbose_name='Name')),
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
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PackagingGroup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
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
                ('name', models.CharField(max_length=255, verbose_name='Name')),
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
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='MaterialPrice',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
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
                ('start_year', models.PositiveIntegerField(db_index=True, verbose_name='Year')),
                (
                    'start_month',
                    models.PositiveIntegerField(
                        choices=[
                            (1, 'January'),
                            (2, 'February'),
                            (3, 'March'),
                            (4, 'April'),
                            (5, 'May'),
                            (6, 'June'),
                            (7, 'July'),
                            (8, 'August'),
                            (9, 'September'),
                            (10, 'October'),
                            (11, 'November'),
                            (12, 'December'),
                        ],
                        db_index=True,
                        verbose_name='Month',
                    ),
                ),
                ('price_per_kg', models.PositiveIntegerField(verbose_name='Price (Kg)')),
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
                (
                    'related_material',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to='packaging.material', verbose_name='Material'
                    ),
                ),
            ],
            options={
                'verbose_name': 'Price',
                'verbose_name_plural': 'Prices',
                'abstract': False,
            },
        ),
        migrations.AddConstraint(
            model_name='materialprice',
            constraint=models.UniqueConstraint(
                fields=('related_material', 'start_year', 'start_month'), name='unique_material_price'
            ),
        ),
    ]
