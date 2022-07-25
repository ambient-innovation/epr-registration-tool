from django.contrib.auth.hashers import make_password

from model_bakery.recipe import Recipe, seq

SUPER_USER_PASSWORD = 'IamKing789'
SOME_USER_PASSWORD = 'IamNotKing789'

super_user = Recipe(
    'account.User',
    email=seq('superuser', suffix='@local.local'),
    password=make_password(SUPER_USER_PASSWORD),
    is_superuser=True,
    is_active=True,
)

user = Recipe(
    'account.User',
    email=seq('user', suffix='@local.local'),
    password=make_password(SOME_USER_PASSWORD),
    is_active=True,
)

email_change_request = Recipe(
    'account.EmailChangeRequest',
    email=seq('changedEmailUser', suffix='@local.local'),
)
