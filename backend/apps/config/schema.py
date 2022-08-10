import time

from django.conf import settings

import strawberry
from graphql.validation import NoDeprecatedCustomRule, NoSchemaIntrospectionCustomRule
from sentry_sdk import capture_message, configure_scope
from strawberry.extensions import AddValidationRules, Extension, QueryDepthLimiter

from account.api.mutations import AccountMutation
from account.api.queries import UserQuery
from company.api.mutations import RegisterCompanyMutation
from company.api.query import Query as CompanyQuery
from packaging.api.queries import PackagingQuery
from packaging_report.api.mutations import PackagingReportMutation
from packaging_report.api.queries import Query as PackagingReportQuery


class PerformanceMonitoringExtension(Extension):
    """
    Inconsistent application experiences aren’t only due to errors or crashes. In addition to error monitoring, we need
    to monitor our application for slow api responses.
    """

    def resolve(self, _next, root, info, *args, **kwargs):
        start_time = time.time()
        result = super().resolve(_next, root, info, *args, **kwargs)
        finish_in = (time.time() - start_time) * 1000
        operation_type = info.operation.operation.value
        if (
            (operation_type == 'query' and finish_in > settings.SLOW_QUERY_THRESHOLD_MS)
            or (operation_type == 'mutation' and finish_in > settings.SLOW_MUTATION_THRESHOLD_MS)
            and settings.SENTRY_ENABLED
        ):
            with configure_scope() as scope:
                scope.set_extra("execution_time", f'{finish_in:.2f}ms')
                capture_message(f'Critical {operation_type} performance detected: {info.operation.name.value}')

        return result


@strawberry.type
class Query(UserQuery, CompanyQuery, PackagingQuery, PackagingReportQuery):
    @strawberry.field
    def hello_world(self) -> str:
        return 'Hello World'


@strawberry.type
class Mutation(AccountMutation, RegisterCompanyMutation, PackagingReportMutation):
    pass


schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    extensions=[
        PerformanceMonitoringExtension,
        QueryDepthLimiter(max_depth=10),
        AddValidationRules([NoSchemaIntrospectionCustomRule, NoDeprecatedCustomRule]),
    ],
)
