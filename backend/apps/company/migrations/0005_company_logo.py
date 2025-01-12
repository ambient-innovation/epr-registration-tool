# Generated by Django 4.0.4 on 2022-07-08 08:05

from django.db import migrations, models

import apps.common.storage_backend
import apps.company.validators


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0004_company_identification_number_companycontactinfo'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='logo',
            field=models.ImageField(
                blank=True,
                max_length=255,
                null=True,
                storage=apps.common.storage_backend.private_file_storage,
                upload_to='logos',
                validators=[
                    apps.company.validators.validate_max_image_size,
                    apps.company.validators.validate_allowed_image_formats,
                ],
                verbose_name='Logo',
            ),
        ),
    ]
