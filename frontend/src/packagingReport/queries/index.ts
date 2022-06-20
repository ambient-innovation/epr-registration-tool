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
      forecast {
        id
        materialRecords {
          quantity
          packagingGroup {
            id
            name
          }
          packagingMaterial: material {
            id
            name
          }
        }
      }
    }
  }
`
