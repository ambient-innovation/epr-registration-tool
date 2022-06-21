import pytz

from common.tests.test_base import BaseApiTestCase
from common.utils import make_local_datetime_at


class UtilsTestCase(BaseApiTestCase):
    def test_make_aware_datetime(self):
        aware_date = make_local_datetime_at(2022, 6, 'Europe/Berlin')
        utc_date = aware_date.astimezone(pytz.utc)
        self.assertEqual('2022-06-01 00:00:00+02:00', str(aware_date))
        self.assertEqual('2022-05-31 22:00:00+00:00', str(utc_date))
