import { gql } from '@apollo/client'

export const PACKAGING_REPORTS_QUERY = gql`
  query packagingReports {
    packagingReports {
      createdAt
      id
      startMonth
      year
      timezoneInfo
      timeframe
      packagingGroupsCount
    }
  }
`
