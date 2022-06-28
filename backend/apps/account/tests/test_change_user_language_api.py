from common.tests.test_base import BaseApiTestCase


class AccountChangeLanguageMutationTestCase(BaseApiTestCase):
    AUTO_CREATE_USERS = True
    ALWAYS_LOGIN_USER = True

    MUTATION = """
        mutation changeLanguage(
            $languageCode: String!
        ) {
            changeLanguage(
                languageCode: $languageCode
            )
        }
    """

    def test_change_user_language(self):
        content = self.query_and_load_data(
            self.MUTATION,
            variables={'languageCode': 'ar'},
        )
        self.assertEqual('UPDATED', content['changeLanguage'])
        self.user.refresh_from_db()
        self.assertEqual('ar', self.user.language_preference)

    def test_change_user_language_not_supported_language_code_fails(self):
        self.query_and_assert_error(
            self.MUTATION,
            message='languageCodeNotSupported',
            variables={'languageCode': 'fr'},
        )

    def test_change_user_language_send_upper_case_language_code(self):
        content = self.query_and_load_data(
            self.MUTATION,
            variables={'languageCode': 'EN'},
        )
        self.assertEqual('UPDATED', content['changeLanguage'])
