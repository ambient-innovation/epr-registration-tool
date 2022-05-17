import strawberry
from strawberry.django import auto

from common.models import Sector, Subsector


@strawberry.django.type(Sector)
class Sector:
    id: auto
    name: auto


@strawberry.django.type(Subsector)
class Subsector:
    id: auto
    name: auto
