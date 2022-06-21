import { gql } from '@apollo/client'

export const PACKAGING_REPORT_FORECAST_SUBMIT = gql`
  mutation packagingReportForecastSubmit(
    $year: Int!
    $startMonth: Int!
    $tzInfo: String!
    $timeframe: TimeframeType!
    $packagingRecords: [PackagingGroupInput!]!
  ) {
    packagingReportForecastSubmit(
      year: $year
      startMonth: $startMonth
      tzInfo: $tzInfo
      timeframe: $timeframe
      packagingRecords: $packagingRecords
    )
  }
`

export const PACKAGING_REPORT_FORECAST_UPDATE = gql`
  mutation packagingReportForecastUpdate(
    $packagingReportId: ID!
    $packagingRecords: [PackagingGroupInput!]!
  ) {
    packagingReportForecastUpdate(
      packagingReportId: $packagingReportId
      packagingRecords: $packagingRecords
    )
  }
`
