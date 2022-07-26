# Generated by Django 4.0.4 on 2022-07-18 12:52

import django.core.validators
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('account', '0004_user_language_preference'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmailChangeRequest',
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
                    'email',
                    models.EmailField(
                        max_length=254,
                        unique=False,
                        validators=[django.core.validators.EmailValidator()],
                        verbose_name='Email address',
                    ),
                ),
                (
                    'related_user',
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        primary_key=True,
                        related_name='email_change_request',
                        serialize=False,
                        to=settings.AUTH_USER_MODEL,
                        verbose_name='User',
                    ),
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
                'verbose_name': 'Email Change Request',
                'verbose_name_plural': 'Email Change Requests',
            },
        ),
    ]