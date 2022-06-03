import strawberry
from strawberry.django import auto

from account.models import User


@strawberry.django.type(User)
class UserType:
    id: auto
    email: auto
    title: auto
    full_name: auto
