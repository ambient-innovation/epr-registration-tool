import { gql } from '@apollo/client'

export const PACKAGING_REPORT_FORECAST_DELETE = gql`
  mutation packagingReportForecastDelete($packagingReportId: ID!) {
    packagingReportForecastDelete(packagingReportId: $packagingReportId)
  }
`
