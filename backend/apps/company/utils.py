import math
from random import randint

REGISTRATION_NUMBER_DIGITS = 10
REGISTRATION_NUMBER_MIN = int(math.pow(10, REGISTRATION_NUMBER_DIGITS - 1))
REGISTRATION_NUMBER_MAX = 9 * int(math.pow(10, REGISTRATION_NUMBER_DIGITS - 1))


def generate_registration_number(country_code: str) -> str:
    assert type(country_code) == str
    assert len(country_code) == 2
    assert country_code.isalpha()
    numeric_part = randint(REGISTRATION_NUMBER_MIN, REGISTRATION_NUMBER_MAX)
    return f'{country_code.upper()}{numeric_part}'


def generate_unique_registration_number(company) -> str:
    from apps.company.models import Company

    attempt = 1
    while attempt < 10:
        candidate = generate_registration_number(company.country_code)
        if not Company.objects.filter(registration_number=candidate).exists():
            return candidate
        attempt += 1
    raise Exception(f'Failed to generate unique registration number after {attempt} attempts')
