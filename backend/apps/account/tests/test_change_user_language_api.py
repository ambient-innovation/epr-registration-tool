from common.tests.test_base import BaseApiTestCase


class AccountChangeLanguageMutationTestCase(BaseApiTestCase):
    AUTO_CREATE_USERS = True
    ALWAYS_LOGIN_USER = True

    MUTATION = """
        mutation changeLanguage(
            $languageCode: LanguageEnum!
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
        resp = self.query(
            self.MUTATION,
            variables={'languageCode': 'fr'},
        )
        self.assertResponseHasErrors(resp)
