from typing import Optional

import strawberry
from strawberry.types import Info

from apps.account.api.types import UserType


@strawberry.type
class UserQuery:
    @strawberry.field
    def me(self, info: Info) -> Optional[UserType]:
        user = info.context.request.user
        return user if user.is_authenticated else None
