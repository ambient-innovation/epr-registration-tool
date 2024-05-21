# Generated by Django 4.0.4 on 2022-07-13 10:00

from django.db import migrations, models

import apps.company.validators


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0005_company_logo'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='country_code',
            field=models.CharField(
                default='en',
                help_text=(
                    '<a target="_blank" href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2">ISO 3166-1-alpha-2</a> '
                    '(lower cased)'
                ),
                max_length=2,
                validators=[apps.company.validators.validate_is_lower_case],
                verbose_name='Country code',
            ),
        ),
    ]
