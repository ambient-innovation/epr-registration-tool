from django.db import models
from django.utils.translation import gettext_lazy as _


class Month(models.IntegerChoices):
    JANUARY = 1, _("January")
    FEBRUARY = 2, _("February")
    MARCH = 3, _("March")
    APRIL = 4, _("April")
    MAY = 5, _("May")
    JUNE = 6, _("June")
    JULY = 7, _("July")
    AUGUST = 8, _("August")
    SEPTEMBER = 9, _("September")
    OCTOBER = 10, _("October")
    NOVEMBER = 11, _("November")
    DECEMBER = 12, _("December")

    @staticmethod
    def get_label_by_value(value):
        choices = [c[1] for c in Month.choices if c[0] == value]
        return choices[0] if len(choices) else None
