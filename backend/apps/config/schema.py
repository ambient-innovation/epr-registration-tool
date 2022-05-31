import strawberry

from account.api.queries import UserQuery
from company.api.mutations import RegisterCompanyMutation


@strawberry.type
class Query(UserQuery):
    @strawberry.field
    def hello_world(self) -> str:
        return 'Hello World'


@strawberry.type
class Mutation(RegisterCompanyMutation):
    pass


schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
)
