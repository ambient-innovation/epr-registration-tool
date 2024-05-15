import json

from django.contrib.auth import get_user_model
from django.http import HttpRequest
from django.test import Client, TestCase

from model_bakery import baker

from apps.account.tests.baker_recipes import SOME_USER_PASSWORD, SUPER_USER_PASSWORD
from apps.common.tests.graphql_test import GraphQLTestCase

UserModel = get_user_model()


class BaseTestCase(TestCase):
    AUTO_CREATE_USERS = False
    ALWAYS_LOGIN_USER = False
    super_user = user = None

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        if cls.AUTO_CREATE_USERS:
            cls.super_user = baker.make_recipe('account.tests.super_user')
            cls.user = baker.make_recipe('account.tests.user')

        cls._client = Client()

    def setUp(self):
        super().setUp()
        if self.ALWAYS_LOGIN_USER:
            self.login_normal_user()

    def tearDown(self):
        self._client.logout()

    def login_superuser(self):
        assert self.super_user is not None, 'Superuser does not exist, consider AUTO_CREATE_USERS=True'
        self._client.login(
            email=self.super_user.email,
            password=SUPER_USER_PASSWORD,
            request=HttpRequest(),
        )

    def login(self, user):
        self._client.login(
            email=user.email,
            password=SOME_USER_PASSWORD,
            request=HttpRequest(),
        )

    @staticmethod
    def create_and_assign_company(user):
        company = baker.make_recipe('company.tests.company', users_queryset=[user])
        baker.make_recipe('company.tests.company_contact_info', related_company=company)
        return company

    def login_normal_user(self):
        assert self.user is not None, 'User does not exist, consider AUTO_CREATE_USERS=True'
        self.login(self.user)

    def logout_user(self):
        self._client.logout()


class BaseApiTestCase(BaseTestCase, GraphQLTestCase):
    @staticmethod
    def load_content(response):
        return json.loads(response.content)

    def assertResponseHasErrorMessage(self, resp, message, message_dict=None):
        """
        Assert that the call was failing with a given message.
        Take care: Even with errors, GraphQL returns status 200!
        """
        content = self.load_content(resp)
        self.assertNotEqual(content['errors'], None, 'Response does not contain errors')
        error_messages = [error['message'] for error in content['errors']]
        self.assertIn(message, error_messages)
        if message_dict:
            self.assertIn(message_dict, [error['extensions']['message_dict'] for error in content['errors']])

    def assertResponseHasErrors(self, resp, msg=None):
        """
        Assert that the call was failing. Take care: Even with errors, GraphQL returns status 200!
        :resp HttpResponse: Response
        """
        content = self.load_content(resp)
        self.assertNotEqual(content["errors"], None, msg or content)

    def assertResponseNoErrors(self, resp, msg=None):
        """
        Assert that the call went through correctly. 200 means the syntax is ok, if there are no `errors`,
        the call was fine.
        :resp HttpResponse: Response
        """
        content = self.load_content(resp)

        self.assertEqual(resp.status_code, 200, msg or content)
        self.assertNotIn("errors", list(content.keys()), msg or content)

    def query_and_load_data(self, *args, **kwargs):
        response = self.query(*args, **kwargs)
        self.assertResponseNoErrors(response)
        return self.load_content(response)['data']

    def query_and_assert_error(self, *args, message: str = None, message_dict: dict = None, **kwargs):
        response = self.query(*args, **kwargs)
        if message:
            self.assertResponseHasErrorMessage(response, message=message, message_dict=message_dict)

        if not message and not message_dict:
            self.assertResponseHasErrors(response)
        return response
