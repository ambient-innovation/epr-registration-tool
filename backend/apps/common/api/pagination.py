import typing

from django.core.paginator import Paginator
from django.utils.functional import cached_property

import strawberry


class CustomPaginator(Paginator):
    """
    Slightly adjusted Paginator.

    The only difference is:
    This paginator constructor accepts a second queryset which is only used for counting the total number of objects.

    The reason for this is:
    We noticed, that annotations are applied, even if they don't affect the number of rows counted,
    e.g. when adding columns which are not used for filtering. This has a significant impact on the query
    performance and can be avoided when using another queryset without annotations or sorting applied.
    """

    def __init__(self, queryset, per_page, count_queryset=None, **kwargs):
        self.count_queryset = count_queryset if count_queryset is not None else queryset
        super().__init__(queryset, per_page, **kwargs)

    @cached_property
    def count(self):
        return self.count_queryset.count()


@strawberry.type
class PaginatorType:
    per_page: int
    current_page: int
    per_page: int
    num_pages: int
    total_count: int
    has_next_page: bool


T = typing.TypeVar('T')


@strawberry.type
class PaginationResult(typing.Generic[T]):
    items: typing.List[T]
    page_info: PaginatorType


@strawberry.input
class PaginationInput:
    page: int
    limit: int
