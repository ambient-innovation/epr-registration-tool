import {
  PackagingReportsDocument,
  PackagingReportsQuery,
  PackagingReportsQueryVariables,
  PackagingReportsSortingOption,
  TimeframeType,
} from '@/api/__types__'
import { ApolloMock } from '@/utils/typescript.utils'

export const mockReports: PackagingReportsQuery['packagingReports']['items'] = [
  {
    createdAt: '2022-06-10T14:38:42.483799+00:00',
    id: '1',
    startMonth: 7,
    year: 2022,
    timezoneInfo: 'Europe/Berlin',
    timeframe: TimeframeType.MONTH,
    packagingGroupsCount: 3,
    isFinalReportSubmitted: true,
    isForecastEditable: false,
    fees: 1500,
    endDatetime: '2022-08-31T23:59:59.999999+00:00',
    isPaid: true,
  },
  {
    createdAt: '2022-06-10T14:39:18.448143+00:00',
    id: '2',
    startMonth: 7,
    year: 2023,
    timezoneInfo: 'Europe/Berlin',
    timeframe: TimeframeType.THREE_MONTHS,
    packagingGroupsCount: 5,
    isFinalReportSubmitted: false,
    isForecastEditable: true,
    fees: null,
    endDatetime: '2022-10-31T23:59:59.999999+00:00',
    isPaid: false,
  },
  {
    createdAt: '2021-06-10T14:42:45.135706+00:00',
    id: '3',
    startMonth: 7,
    year: 2021,
    timezoneInfo: 'Europe/Berlin',
    timeframe: TimeframeType.THREE_MONTHS,
    packagingGroupsCount: 1,
    isFinalReportSubmitted: false,
    isForecastEditable: false,
    fees: null,
    endDatetime: '2022-10-31T23:59:59.999999+00:00',
    isPaid: false,
  },
]

const defaultVariables = {
  pagination: {
    page: 1,
    limit: 12,
  },
  filter: {
    year: null,
  },
  sorting: PackagingReportsSortingOption.NEWEST_FIRST,
}

const defaultPageInfo = {
  perPage: defaultVariables.pagination.limit,
  currentPage: 1,
  numPages: 1,
  totalCount: 0,
  hasNextPage: false,
}

export const packagingReportsMock: ApolloMock<
  PackagingReportsQuery,
  PackagingReportsQueryVariables
> = {
  delay: 1000,
  request: {
    query: PackagingReportsDocument,
    variables: defaultVariables,
  },
  result: {
    data: {
      packagingReports: {
        items: mockReports,
        pageInfo: defaultPageInfo,
      },
    },
  },
}

export const packagingReports2022Mock: ApolloMock<
  PackagingReportsQuery,
  PackagingReportsQueryVariables
> = {
  delay: 1000,
  request: {
    query: PackagingReportsDocument,
    variables: {
      ...defaultVariables,
      filter: {
        ...defaultVariables.filter,
        year: 2022,
      },
    },
  },
  result: {
    data: {
      packagingReports: {
        items: mockReports.filter((item) => item.year === 2022),
        pageInfo: defaultPageInfo,
      },
    },
  },
}

export const packagingReportsEmpyMock: ApolloMock<
  PackagingReportsQuery,
  PackagingReportsQueryVariables
> = {
  request: {
    query: PackagingReportsDocument,
    variables: defaultVariables,
  },
  result: {
    data: {
      packagingReports: {
        items: [],
        pageInfo: defaultPageInfo,
      },
    },
  },
}
