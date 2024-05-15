from apps.common.tests.test_base import BaseApiTestCase


class AccountChangeLanguageMutationTestCase(BaseApiTestCase):
    AUTO_CREATE_USERS = True
    ALWAYS_LOGIN_USER = True

    MUTATION = """
        mutation changePassword(
            $oldPassword: String!
            $newPassword: String!
        ) {
            changePassword(
                oldPassword: $oldPassword
                newPassword: $newPassword
            )
        }
    """

    def test_user_password_changes(self):
        content = self.query_and_load_data(
            self.MUTATION,
            variables={'oldPassword': 'IamNotKing789', 'newPassword': 'IamKing_666'},
        )
        self.assertEqual('UPDATED', content['changePassword'])

    def test_user_password_changes_validation_fails_old_password_wrong(self):
        self.query_and_assert_error(
            self.MUTATION,
            message='invalidCredentials',
            variables={'oldPassword': 'WrongPassword', 'newPassword': 'IamKing_666'},
        )

    def test_user_password_changes_validation_fails_same_password(self):
        self.query_and_assert_error(
            self.MUTATION,
            message='identicalPasswordNotAllowed',
            variables={'oldPassword': 'IamNotKing789', 'newPassword': 'IamNotKing789'},
        )
