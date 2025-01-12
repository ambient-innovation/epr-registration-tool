# Generated by Django 4.0.4 on 2022-06-10 11:52

import django.db.models.deletion
from django.db import migrations, models


def assign_existing_reports_to_company(apps, schema_editor):
    Company = apps.get_model('company', 'Company')
    PackagingReport = apps.get_model('packaging_report', 'PackagingReport')

    company = Company.objects.first()
    all_packaging_reports = PackagingReport.objects.all().prefetch_related('created_by__related_company')
    all_packaging_reports_count = len(all_packaging_reports)

    if all_packaging_reports_count:

        if not company:
            raise Exception('No company available to assign to existing reports')

        for report in all_packaging_reports:
            created_by = report.created_by
            created_by_company = created_by.related_company if created_by else None
            report.related_company = created_by_company or company
            report.save()

        print(' 🚀 updated {} packaging_reports'.format(all_packaging_reports_count), end='')

    else:
        print(' 👌️ no reports to update')


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0003_company_is_active'),
        ('packaging_report', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='packagingreport',
            name='related_company',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='packaging_report_queryset',
                to='company.company',
                verbose_name='Company',
                null=True,
            ),
        ),
        migrations.RunPython(assign_existing_reports_to_company, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='packagingreport',
            name='related_company',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='packaging_report_queryset',
                to='company.company',
                verbose_name='Company',
            ),
        ),
    ]
