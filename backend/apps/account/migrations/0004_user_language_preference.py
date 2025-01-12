# Generated by Django 4.0.4 on 2022-07-08 06:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0003_notificationsettings'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='language_preference',
            field=models.CharField(
                blank=True,
                choices=[('en', 'En'), ('ar', 'Ar')],
                default='en',
                max_length=2,
                verbose_name='Language Preference',
                help_text='Preferred language for email correspondence.',
            ),
        ),
    ]
