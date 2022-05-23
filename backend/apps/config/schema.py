import strawberry

from company.api.mutations import RegisterCompanyMutation
from company.api.query import Query as CompanyQuery


@strawberry.type
class Query(CompanyQuery):
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
