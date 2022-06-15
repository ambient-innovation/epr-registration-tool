from django.contrib.auth import get_user_model
from django.test import TestCase

User = get_user_model()


class UserModelTestCase(TestCase):
    def test_salutation(self):
        self.assertEqual('Anonymous 🥷', User().display_name)
        self.assertEqual('Mrs. Anonymous 🥷', User(title='mrs').display_name)
        self.assertEqual('Chuck Norris', User(full_name='Chuck Norris').display_name)
        self.assertEqual('Mr. Chuck Norris', User(title='mr', full_name='Chuck Norris').display_name)
        self.assertEqual('Admin', User(is_superuser=True).display_name)
        self.assertEqual('Mrs. Admin', User(title='mrs', is_superuser=True).display_name)
