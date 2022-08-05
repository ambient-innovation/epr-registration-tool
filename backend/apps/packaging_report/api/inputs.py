import typing

import strawberry


@strawberry.input
class PackagingReportsFilterInput:
    year: typing.Optional[int]
