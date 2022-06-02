from apps.common.tests.test_base import BaseApiTestCase


class ExampleTestCase(BaseApiTestCase):

    QUERY = """
        query TestQuery {
                helloWorld
            }
        """

    ERROR_QUERY = """
        query TestQuery {
                holaMundo
            }
        """

    def test_hello_world_api(self):
        content = self.query_and_load_data(self.QUERY)
        self.assertEqual(content['helloWorld'], 'Hello World')

    def test_api_with_error(self):
        self.query_and_assert_error(self.ERROR_QUERY, message="Cannot query field 'holaMundo' on type 'Query'.")
