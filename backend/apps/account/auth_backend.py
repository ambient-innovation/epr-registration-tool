from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

UserModel = get_user_model()


class CustomModelBackend(ModelBackend):
    def user_can_authenticate(self, user):
        return getattr(user, 'can_authenticate', False)
