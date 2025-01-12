# Generated by Django 4.0.4 on 2022-08-03 13:53

from django.db import migrations

import wagtail.blocks
import wagtail.fields
import wagtail.images.blocks

import apps.cms.blocks
import apps.cms.validators


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0003_add_pdf_download_block'),
    ]

    operations = [
        migrations.AlterField(
            model_name='homepage',
            name='body',
            field=wagtail.fields.StreamField(
                [
                    (
                        'text',
                        wagtail.blocks.StructBlock(
                            [
                                ('heading', wagtail.blocks.CharBlock()),
                                (
                                    'body',
                                    apps.cms.blocks.CustomRichTextBlock(
                                        features=['h3', 'bold', 'italic', 'ul', 'ol', 'link']
                                    ),
                                ),
                                (
                                    'cta',
                                    wagtail.blocks.StructBlock(
                                        [
                                            ('label', wagtail.blocks.CharBlock(required=False)),
                                            ('internal_page', wagtail.blocks.PageChooserBlock(required=False)),
                                            ('external_link', wagtail.blocks.URLBlock(required=False)),
                                        ]
                                    ),
                                ),
                                (
                                    'orientation',
                                    wagtail.blocks.ChoiceBlock(choices=[('left', 'Left'), ('center', 'Centered')]),
                                ),
                                (
                                    'background',
                                    wagtail.blocks.ChoiceBlock(
                                        choices=[('default', 'White'), ('shaded', 'Light gray')]
                                    ),
                                ),
                            ]
                        ),
                    ),
                    (
                        'fullWidthImage',
                        wagtail.blocks.StructBlock(
                            [
                                (
                                    'image',
                                    wagtail.blocks.StructBlock(
                                        [
                                            ('alt_text', wagtail.blocks.CharBlock()),
                                            ('image', wagtail.images.blocks.ImageChooserBlock(required=False)),
                                            ('caption', wagtail.blocks.CharBlock(required=False)),
                                        ]
                                    ),
                                ),
                                ('heading', wagtail.blocks.CharBlock(required=False)),
                                (
                                    'background',
                                    wagtail.blocks.ChoiceBlock(
                                        choices=[('default', 'White'), ('shaded', 'Light gray')]
                                    ),
                                ),
                            ]
                        ),
                    ),
                    (
                        'imageWithText',
                        wagtail.blocks.StructBlock(
                            [
                                (
                                    'image',
                                    wagtail.blocks.StructBlock(
                                        [
                                            ('alt_text', wagtail.blocks.CharBlock()),
                                            ('image', wagtail.images.blocks.ImageChooserBlock(required=False)),
                                            ('caption', wagtail.blocks.CharBlock(required=False)),
                                        ]
                                    ),
                                ),
                                (
                                    'text',
                                    wagtail.blocks.StructBlock(
                                        [
                                            ('heading', wagtail.blocks.CharBlock()),
                                            (
                                                'body',
                                                apps.cms.blocks.CustomRichTextBlock(
                                                    features=['h3', 'bold', 'italic', 'ul', 'ol', 'link']
                                                ),
                                            ),
                                            (
                                                'cta',
                                                wagtail.blocks.StructBlock(
                                                    [
                                                        ('label', wagtail.blocks.CharBlock(required=False)),
                                                        (
                                                            'internal_page',
                                                            wagtail.blocks.PageChooserBlock(required=False),
                                                        ),
                                                        ('external_link', wagtail.blocks.URLBlock(required=False)),
                                                    ]
                                                ),
                                            ),
                                        ]
                                    ),
                                ),
                                (
                                    'orientation',
                                    wagtail.blocks.ChoiceBlock(
                                        choices=[
                                            ('textFirst', 'Text first'),
                                            ('imageFirst', 'Image first'),
                                            ('fullWidthImage', 'Full width image'),
                                        ]
                                    ),
                                ),
                                (
                                    'background',
                                    wagtail.blocks.ChoiceBlock(
                                        choices=[('default', 'White'), ('shaded', 'Light gray')]
                                    ),
                                ),
                            ]
                        ),
                    ),
                    (
                        'pdfDownload',
                        wagtail.blocks.StructBlock(
                            [
                                (
                                    'text',
                                    wagtail.blocks.StructBlock(
                                        [
                                            ('heading', wagtail.blocks.CharBlock()),
                                            (
                                                'body',
                                                apps.cms.blocks.CustomRichTextBlock(
                                                    features=['h3', 'bold', 'italic', 'ul', 'ol', 'link']
                                                ),
                                            ),
                                            (
                                                'cta',
                                                wagtail.blocks.StructBlock(
                                                    [
                                                        ('label', wagtail.blocks.CharBlock(required=False)),
                                                        (
                                                            'internal_page',
                                                            wagtail.blocks.PageChooserBlock(required=False),
                                                        ),
                                                        ('external_link', wagtail.blocks.URLBlock(required=False)),
                                                    ]
                                                ),
                                            ),
                                        ]
                                    ),
                                ),
                                (
                                    'files',
                                    wagtail.blocks.ListBlock(
                                        child_block=apps.cms.blocks.PdfDocumentBlock(
                                            help_text='Please select a PDF file',
                                            validators=(apps.cms.validators.validate_is_pdf,),
                                        )
                                    ),
                                ),
                                (
                                    'background',
                                    wagtail.blocks.ChoiceBlock(
                                        choices=[('default', 'White'), ('shaded', 'Light gray')]
                                    ),
                                ),
                            ]
                        ),
                    ),
                ],
                blank=True,
                use_json_field=True,
            ),
        ),
        migrations.AlterField(
            model_name='standardpage',
            name='body',
            field=wagtail.fields.StreamField(
                [
                    (
                        'text',
                        wagtail.blocks.StructBlock(
                            [
                                ('heading', wagtail.blocks.CharBlock()),
                                (
                                    'body',
                                    apps.cms.blocks.CustomRichTextBlock(
                                        features=['h3', 'bold', 'italic', 'ul', 'ol', 'link']
                                    ),
                                ),
                                (
                                    'cta',
                                    wagtail.blocks.StructBlock(
                                        [
                                            ('label', wagtail.blocks.CharBlock(required=False)),
                                            ('internal_page', wagtail.blocks.PageChooserBlock(required=False)),
                                            ('external_link', wagtail.blocks.URLBlock(required=False)),
                                        ]
                                    ),
                                ),
                                (
                                    'orientation',
                                    wagtail.blocks.ChoiceBlock(choices=[('left', 'Left'), ('center', 'Centered')]),
                                ),
                                (
                                    'background',
                                    wagtail.blocks.ChoiceBlock(
                                        choices=[('default', 'White'), ('shaded', 'Light gray')]
                                    ),
                                ),
                            ]
                        ),
                    ),
                    (
                        'fullWidthImage',
                        wagtail.blocks.StructBlock(
                            [
                                (
                                    'image',
                                    wagtail.blocks.StructBlock(
                                        [
                                            ('alt_text', wagtail.blocks.CharBlock()),
                                            ('image', wagtail.images.blocks.ImageChooserBlock(required=False)),
                                            ('caption', wagtail.blocks.CharBlock(required=False)),
                                        ]
                                    ),
                                ),
                                ('heading', wagtail.blocks.CharBlock(required=False)),
                                (
                                    'background',
                                    wagtail.blocks.ChoiceBlock(
                                        choices=[('default', 'White'), ('shaded', 'Light gray')]
                                    ),
                                ),
                            ]
                        ),
                    ),
                    (
                        'imageWithText',
                        wagtail.blocks.StructBlock(
                            [
                                (
                                    'image',
                                    wagtail.blocks.StructBlock(
                                        [
                                            ('alt_text', wagtail.blocks.CharBlock()),
                                            ('image', wagtail.images.blocks.ImageChooserBlock(required=False)),
                                            ('caption', wagtail.blocks.CharBlock(required=False)),
                                        ]
                                    ),
                                ),
                                (
                                    'text',
                                    wagtail.blocks.StructBlock(
                                        [
                                            ('heading', wagtail.blocks.CharBlock()),
                                            (
                                                'body',
                                                apps.cms.blocks.CustomRichTextBlock(
                                                    features=['h3', 'bold', 'italic', 'ul', 'ol', 'link']
                                                ),
                                            ),
                                            (
                                                'cta',
                                                wagtail.blocks.StructBlock(
                                                    [
                                                        ('label', wagtail.blocks.CharBlock(required=False)),
                                                        (
                                                            'internal_page',
                                                            wagtail.blocks.PageChooserBlock(required=False),
                                                        ),
                                                        ('external_link', wagtail.blocks.URLBlock(required=False)),
                                                    ]
                                                ),
                                            ),
                                        ]
                                    ),
                                ),
                                (
                                    'orientation',
                                    wagtail.blocks.ChoiceBlock(
                                        choices=[
                                            ('textFirst', 'Text first'),
                                            ('imageFirst', 'Image first'),
                                            ('fullWidthImage', 'Full width image'),
                                        ]
                                    ),
                                ),
                                (
                                    'background',
                                    wagtail.blocks.ChoiceBlock(
                                        choices=[('default', 'White'), ('shaded', 'Light gray')]
                                    ),
                                ),
                            ]
                        ),
                    ),
                    (
                        'pdfDownload',
                        wagtail.blocks.StructBlock(
                            [
                                (
                                    'text',
                                    wagtail.blocks.StructBlock(
                                        [
                                            ('heading', wagtail.blocks.CharBlock()),
                                            (
                                                'body',
                                                apps.cms.blocks.CustomRichTextBlock(
                                                    features=['h3', 'bold', 'italic', 'ul', 'ol', 'link']
                                                ),
                                            ),
                                            (
                                                'cta',
                                                wagtail.blocks.StructBlock(
                                                    [
                                                        ('label', wagtail.blocks.CharBlock(required=False)),
                                                        (
                                                            'internal_page',
                                                            wagtail.blocks.PageChooserBlock(required=False),
                                                        ),
                                                        ('external_link', wagtail.blocks.URLBlock(required=False)),
                                                    ]
                                                ),
                                            ),
                                        ]
                                    ),
                                ),
                                (
                                    'files',
                                    wagtail.blocks.ListBlock(
                                        child_block=apps.cms.blocks.PdfDocumentBlock(
                                            help_text='Please select a PDF file',
                                            validators=(apps.cms.validators.validate_is_pdf,),
                                        )
                                    ),
                                ),
                                (
                                    'background',
                                    wagtail.blocks.ChoiceBlock(
                                        choices=[('default', 'White'), ('shaded', 'Light gray')]
                                    ),
                                ),
                            ]
                        ),
                    ),
                ],
                blank=True,
                use_json_field=True,
            ),
        ),
    ]
