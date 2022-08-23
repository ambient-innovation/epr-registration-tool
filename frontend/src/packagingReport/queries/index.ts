import { gql } from '@apollo/client'

export const PACKAGING_BASE_DATA = gql`
  query packagingBaseData {
    packagingGroups {
      id
      name
    }
    packagingMaterials {
      id
      name
    }
  }
`

export const HAS_OVERLAPPING_PACKAGING_REPORTS = gql`
  query hasOverlappingPackagingReports(
    $packagingReportId: ID
    $startMonth: Int!
    $year: Int!
    $timeframe: TimeframeType!
  ) {
    hasOverlappingPackagingReports(
      packagingReportId: $packagingReportId
      startMonth: $startMonth
      year: $year
      timeframe: $timeframe
    )
  }
`

export const PACKAGING_REPORT_FEED_ESTIMATION = gql`
  query packagingReportFeesEstimation(
    $year: Int!
    $startMonth: Int!
    $timeframe: TimeframeType!
    $packagingRecords: [PackagingGroupInput!]!
  ) {
    fees: packagingReportFeesEstimation(
      year: $year
      startMonth: $startMonth
      timeframe: $timeframe
      packagingRecords: $packagingRecords
    )
  }
`

export const PACKAGING_REPORT_FORECAST_DETAILS = gql`
  query packagingReportForecastDetails($packagingReportId: ID!) {
    packagingReport: packagingReportForecastDetails(
      packagingReportId: $packagingReportId
    ) {
      id
      timeframe
      year
      startMonth
      timezoneInfo
      isForecastEditable
      isFinalReportSubmitted
      forecast {
        id
        materialRecords {
          id
          quantity
          packagingGroup {
            id
            name
          }
          material {
            id
            name
          }
        }
      }
    }
  }
`
export const PACKAGING_REPORT_FINAL_DETAILS = gql`
  query packagingReportFinalDetails($packagingReportId: ID!) {
    packagingReport: packagingReportFinalDetails(
      packagingReportId: $packagingReportId
    ) {
      id
      timeframe
      year
      startMonth
      timezoneInfo
      isForecastEditable
      isFinalReportSubmitted
      finalReport {
        id
        fees
        materialRecords {
          id
          quantity
          packagingGroup {
            id
            name
          }
          material {
            id
            name
          }
        }
      }
    }
  }
`
