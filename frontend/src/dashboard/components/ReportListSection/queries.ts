import { gql } from '@apollo/client'

export const PACKAGING_REPORTS_QUERY = gql`
  query packagingReports(
    $pagination: PaginationInput!
    $filter: PackagingReportsFilterInput!
    $sorting: PackagingReportsSortingOption!
  ) {
    packagingReports(
      pagination: $pagination
      filter: $filter
      sorting: $sorting
    ) {
      items {
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
        isPaid
        invoiceFile {
          url
        }
      }
      pageInfo {
        perPage
        currentPage
        numPages
        totalCount
        hasNextPage
      }
    }
  }
`
