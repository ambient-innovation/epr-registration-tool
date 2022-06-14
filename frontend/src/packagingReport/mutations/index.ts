import { gql } from '@apollo/client'

export const PACKAGING_REPORT_SUBMIT = gql`
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
