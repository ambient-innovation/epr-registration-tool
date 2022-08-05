import decimal
import typing

import strawberry
from strawberry import ID


@strawberry.input
class MaterialInput:
    material_id: ID
    quantity: decimal.Decimal


@strawberry.input
class PackagingGroupInput:
    packaging_group_id: ID
    material_records: typing.List[MaterialInput]
