import datetime
import warnings
from decimal import Decimal

from packaging.models import MaterialPrice
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

            frames = []
            end_month = self.start_month + self.timeframe - 1
            end_sort_key = MaterialPrice.get_sort_key(self.year, end_month)

            def clean_frames(month, month_price):
                sort_key = MaterialPrice.get_sort_key(self.year, month)
                next_price_change = (
                    MaterialPrice.objects.order_by('sort_key')
                    .filter(sort_key__gt=sort_key, related_material_id=material_id)
                    .first()
                )
                next_sort_key = (
                    MaterialPrice.get_sort_key(next_price_change.start_year, next_price_change.start_month)
                    if next_price_change
                    else None
                )

                if month == end_month:
                    # end of report timeframe
                    period = 1
                    quantity = Decimal(monthly_quantity) * period
                    total = Decimal(quantity) * Decimal(month_price.price_per_kg)
                    frame = {
                        'from': datetime.date(self.year, month, day=1).strftime("%d.%m.%Y"),
                        # f'01.{month}.{self.year}',
                        'to': last_day_of_month(datetime.date(year=self.year, month=month, day=1)).strftime(
                            "%d.%m.%Y"
                        ),  # f'31.{month}.{self.year}',
                        'quantity': round(quantity, 2),
                        'total': round(total, 2),
                        'fee_per_unit': month_price.price_per_kg,
                    }
                    frames.append(frame)
                    return
                elif not next_price_change or next_sort_key > end_sort_key:
                    period = end_month - month + 1
                    quantity = Decimal(monthly_quantity) * period
                    total = Decimal(quantity) * Decimal(month_price.price_per_kg)
                    frame = {
                        'from': datetime.date(self.year, month, day=1).strftime("%d.%m.%Y"),
                        # f'01.{month}.{self.year}',
                        'to': last_day_of_month(datetime.date(year=self.year, month=end_month, day=1)).strftime(
                            "%d.%m.%Y"
                        ),  # f'31.{end_month}.{self.year}',
                        'quantity': round(quantity, 2),
                        'total': round(total, 2),
                        'fee_per_unit': month_price.price_per_kg,
                    }
                    frames.append(frame)
                    return
                else:
                    period = next_price_change.start_month - month
                    quantity = Decimal(monthly_quantity) * period
                    total = Decimal(quantity) * Decimal(month_price.price_per_kg)
                    frame = {
                        'from': datetime.date(self.year, month, day=1).strftime("%d.%m.%Y"),
                        # f'01.{month}.{self.year}',
                        'to': last_day_of_month(
                            datetime.date(year=self.year, month=next_price_change.start_month - 1, day=1)
                        ).strftime("%d.%m.%Y"),
                        # f'31.{next_price_change.start_month - 1}.{next_price_change.start_year}',
                        'quantity': round(quantity, 2),
                        'total': round(total, 2),
                        'fee_per_unit': month_price.price_per_kg,
                    }
                    frames.append(frame)
                    return clean_frames(next_price_change.start_month, next_price_change)

            start_month = self.start_month
            start_month_price = get_material_price_at(material_id, self.year, start_month)
            clean_frames(start_month, start_month_price)
            obj.update(total=round(sum([f['total'] for f in frames]), 2))
            obj['frames'] = frames
            result.append(obj)
        return result
