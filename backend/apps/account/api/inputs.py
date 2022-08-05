import strawberry
from strawberry_django import auto

from account.models import User


@strawberry.django.input(User)
class UserChangeInputType:
    email: auto
    title: auto
    full_name: auto
    position: auto
    phone_or_mobile: auto