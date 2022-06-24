import datetime
import warnings
from decimal import Decimal

from dateutil.relativedelta import relativedelta

from packaging.price_utils import get_material_price_at
from packaging_report.models import FinalSubmission


def last_day_of_month(date):
    if date.month == 12:
        return date.replace(day=31)
    return date.replace(month=date.month + 1, day=1) - datetime.timedelta(days=1)


class InvoiceService:
    def __init__(self, timeframe, year, start_month, final_submission: FinalSubmission):
        self.timeframe = timeframe
        self.year = year
        self.start_month = start_month
        self.final_submission = final_submission
        self.material_records = getattr(final_submission, 'material_records', None)
        if not self.material_records:
            self.material_records = final_submission.material_records_queryset.all()
            warnings.warn('final submission material_records_queryset can be prefetched', SyntaxWarning)

    def get_total_fees(self):
        return self.final_submission.fees

    def clean_material_records(self):
        result = []
        for material_record in self.material_records:
            material_quantity = material_record.quantity
            material_id = material_record.related_packaging_material_id
            monthly_quantity = material_quantity / self.timeframe
            obj = {
                'material_name': material_record.packaging_material.name,
                'packaging_name': material_record.packaging_group.name,
                'quantity': material_quantity,
                'total': 0,
            }
            material_total_fees = 0
            monthly_material_prices = []
            frames = []
            month = 1
            for timeframe_month_index in range(self.timeframe):
                month = self.start_month + timeframe_month_index
                material_price = get_material_price_at(material_id, self.year, month)
                if not monthly_material_prices or material_price.price_per_kg == monthly_material_prices[-1]:
                    monthly_material_prices.append(material_price.price_per_kg)
                else:  # price change at this month
                    total_for_this_period = round(
                        (Decimal(monthly_quantity) * len(monthly_material_prices))
                        * Decimal(monthly_material_prices[0]),
                        2,
                    )
                    material_total_fees = material_total_fees + total_for_this_period
                    frames.append(
                        {
                            'from': (
                                datetime.date(year=self.year, month=month, day=1)
                                - relativedelta(months=len(monthly_material_prices))
                            ).strftime("%d.%m.%Y"),
                            'to': (last_day_of_month(datetime.date(year=self.year, month=month - 1, day=1))).strftime(
                                "%d.%m.%Y"
                            ),
                            'quantity': round(Decimal(monthly_quantity) * len(monthly_material_prices), 2),
                            'total': total_for_this_period,
                            'fee_per_unit': monthly_material_prices[0],
                        }
                    )
                    monthly_material_prices.clear()
                    monthly_material_prices.append(material_price.price_per_kg)
            if monthly_material_prices:
                total_for_this_period = round(
                    (Decimal(monthly_quantity) * len(monthly_material_prices)) * Decimal(monthly_material_prices[0]),
                    2,
                )
                material_total_fees = material_total_fees + total_for_this_period
                frames.append(
                    {
                        'from': (
                            datetime.date(year=self.year, month=month, day=1)
                            - relativedelta(months=len(monthly_material_prices) - 1)
                        ).strftime("%d.%m.%Y"),
                        'to': last_day_of_month(datetime.date(year=self.year, month=month, day=1)).strftime("%d.%m.%Y"),
                        'quantity': round(Decimal(monthly_quantity) * len(monthly_material_prices), 2),
                        'total': total_for_this_period,
                        'fee_per_unit': monthly_material_prices[0],
                    }
                )
            obj.update(total=round(material_total_fees, 2))
            obj['frames'] = frames
            result.append(obj)
        return result
