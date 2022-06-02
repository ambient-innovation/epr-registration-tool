import strawberry

from account.api.queries import UserQuery
from company.api.mutations import RegisterCompanyMutation
from company.api.query import Query as CompanyQuery
from packaging.api.queries import PackagingQuery
from packaging_report.api.mutations import PackagingReportMutation


@strawberry.type
class Query(UserQuery, CompanyQuery, PackagingQuery):
    @strawberry.field
    def hello_world(self) -> str:
        return 'Hello World'


@strawberry.type
class Mutation(RegisterCompanyMutation, PackagingReportMutation):
    pass


schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
)
