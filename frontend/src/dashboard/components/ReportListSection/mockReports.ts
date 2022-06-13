import {
  PackagingReportsDocument,
  PackagingReportsQuery,
  PackagingReportsQueryVariables,
} from '@/api/__types__'
import { ApolloMock } from '@/utils/typescript.utils'

export const mockReports: PackagingReportsQuery['packagingReports'] = [
  {
    createdAt: '2022-06-10T14:38:42.483799+00:00',
    id: '1',
    startMonth: 7,
    year: 2022,
    timezoneInfo: 'Europe/Berlin',
    timeframe: 1,
    packagingGroupsCount: 3,
  },
  {
    createdAt: '2022-06-10T14:39:18.448143+00:00',
    id: '2',
    startMonth: 7,
    year: 2023,
    timezoneInfo: 'Europe/Berlin',
    timeframe: 3,
    packagingGroupsCount: 5,
  },
  {
    createdAt: '2021-06-10T14:42:45.135706+00:00',
    id: '3',
    startMonth: 7,
    year: 2021,
    timezoneInfo: 'Europe/Berlin',
    timeframe: 3,
    packagingGroupsCount: 1,
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
