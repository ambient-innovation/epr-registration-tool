# Generated by Django 4.0.4 on 2022-07-06 14:00

import django.db.models.deletion
from django.db import migrations, models

import wagtail.blocks
import wagtail.fields
import wagtail.images.blocks

import apps.cms.headless_mixin


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('wagtailcore', '0069_log_entry_jsonfield'),
    ]

    operations = [
        migrations.CreateModel(
            name='HomePage',
            fields=[
                (
                    'page_ptr',
                    models.OneToOneField(
                        auto_created=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        parent_link=True,
                        primary_key=True,
                        serialize=False,
                        to='wagtailcore.page',
                    ),
                ),
                (
                    'body',
                    wagtail.fields.StreamField(
                        [
                            (
                                'paragraph',
                                wagtail.blocks.RichTextBlock(features=['h2', 'h3', 'bold', 'italic', 'ul', 'ol']),
                            )
                        ],
                        use_json_field=True,
                    ),
                ),
            ],
            options={
                'abstract': False,
            },
            bases=(apps.cms.headless_mixin.CustomHeadlessMixin, 'wagtailcore.page'),
        ),
        migrations.CreateModel(
            name='StandardPage',
            fields=[
                (
                    'page_ptr',
                    models.OneToOneField(
                        auto_created=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        parent_link=True,
                        primary_key=True,
                        serialize=False,
                        to='wagtailcore.page',
                    ),
                ),
                (
                    'body',
                    wagtail.fields.StreamField(
                        [
                            (
                                'paragraph',
                                wagtail.blocks.RichTextBlock(features=['h2', 'h3', 'bold', 'italic', 'ul', 'ol']),
                            )
                        ],
                        use_json_field=True,
                    ),
                ),
            ],
            options={
                'abstract': False,
            },
            bases=(apps.cms.headless_mixin.CustomHeadlessMixin, 'wagtailcore.page'),
        ),
    ]
