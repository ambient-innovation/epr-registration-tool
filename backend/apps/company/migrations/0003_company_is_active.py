# Generated by Django 4.0.4 on 2022-06-01 08:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0002_add_common_info_fields_to_company'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='is_active',
            field=models.BooleanField(
                blank=True,
                default=False,
                help_text='No user of the company will be able to log in as long the company is inactive.',
                verbose_name='Active',
            ),
        ),
    ]