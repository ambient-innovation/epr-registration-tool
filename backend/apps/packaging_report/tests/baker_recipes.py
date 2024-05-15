from model_bakery.recipe import Recipe, foreign_key

from apps.packaging_report.models import TimeframeType

packaging_report = Recipe(
    'packaging_report.PackagingReport',
    related_company=foreign_key('company.tests.company'),
    timeframe=TimeframeType.THREE_MONTHS,
    year=2022,
    timezone_info='Asia/Amman',
)
