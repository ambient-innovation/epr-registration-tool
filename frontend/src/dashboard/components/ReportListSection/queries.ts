import { gql } from '@apollo/client'

export const PACKAGING_REPORTS_QUERY = gql`
  query packagingReports {
    packagingReports {
      id
      createdAt
      startMonth
      year
      timezoneInfo
      timeframe
      packagingGroupsCount
      isForecastEditable
      isFinalReportSubmitted
      endDatetime
      fees
      invoiceFile {
        url
      }
    }
  }
`
