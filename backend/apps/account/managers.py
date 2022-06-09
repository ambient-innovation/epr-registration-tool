from django.contrib.auth.base_user import BaseUserManager
from django.db.models import QuerySet


class UserQuerySet(QuerySet):
    def staff(self):
        return self.filter(is_superuser=True)


class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(email=self.normalize_email(email), full_name='Admin')

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        """
        Creates and saves a superuser with the given email and password.
        """
        user = self.create_user(
            email,
            password=password,
        )
        user.is_superuser = True
        user.is_active = True
        user.save(using=self._db)
        return user
