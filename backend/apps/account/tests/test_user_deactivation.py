from model_bakery import baker

from account.tests.baker_recipes import SOME_USER_PASSWORD
from common.tests.test_base import BaseTestCase


class UserDeactivationTestCase(BaseTestCase):
    def test_deactivate_user_resets_password(self):
        """
        Whe users are deactivated the password will be reset.
        This is the default behaviour of ai_auth_kit to invalidate all tokens.

        See `ai_kit_auth.signals.invalidate_tokens_on_user_deactivation`
        """
        user = baker.make_recipe('account.tests.user')
        self.assertEqual(True, user.check_password(SOME_USER_PASSWORD))
        user.is_active = False
        user.save()
        self.assertEqual(False, user.check_password(SOME_USER_PASSWORD))
