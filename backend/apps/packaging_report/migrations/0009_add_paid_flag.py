# Generated by Django 4.0.4 on 2022-08-22 13:54

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('packaging_report', '0008_alter_finalsubmission_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='packagingreport',
            name='is_paid',
            field=models.BooleanField(
                default=False, help_text='Whether fee has been paid or not.', verbose_name='Paid'
            ),
        ),
    ]
