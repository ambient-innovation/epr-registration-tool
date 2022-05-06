from django.contrib.auth import get_user_model
from django.http import HttpRequest
from django.test import TestCase

from model_bakery import baker

USER_PASSWORD = 'IamKing789'
SUPER_USER_PASSWORD = 'IamNotKing789'

UserModel = get_user_model()


class BaseTestCase(TestCase):
    AUTO_CREATE_USERS = True
    ALWAYS_LOGIN_USER = False
    super_user = user = None

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        if cls.AUTO_CREATE_USERS:
            cls.super_user = baker.make_recipe('account.tests.super_user')
            cls.user = baker.make_recipe('account.tests.user')

    def setUp(self):
        super().setUp()
        if self.ALWAYS_LOGIN_USER:
            self.login_normal_user()

    def tearDown(self):
        self.client.logout()

    def login_superuser(self):
        self.client.login(
            email=self.super_user.email,
            password=SUPER_USER_PASSWORD,
            request=HttpRequest(),
        )

    def login_normal_user(self):
        self.client.login(
            email=self.user.email,
            password=USER_PASSWORD,
            request=HttpRequest(),
        )

    def logout_user(self):
        self.client.logout()
