import {
  PackagingReportsDocument,
  PackagingReportsQuery,
  PackagingReportsQueryVariables,
  TimeframeType,
} from '@/api/__types__'
import { ApolloMock } from '@/utils/typescript.utils'

export const mockReports: PackagingReportsQuery['packagingReports'] = [
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
  },
]

export const packagingReportsMock: ApolloMock<
  PackagingReportsQuery,
  PackagingReportsQueryVariables
> = {
  request: {
    query: PackagingReportsDocument,
    variables: {},
  },
  result: {
    data: {
      packagingReports: mockReports,
    },
  },
}

export const packagingReportsEmpyMock: ApolloMock<
  PackagingReportsQuery,
  PackagingReportsQueryVariables
> = {
  request: {
    query: PackagingReportsDocument,
    variables: {},
  },
  result: {
    data: {
      packagingReports: [],
    },
  },
}
