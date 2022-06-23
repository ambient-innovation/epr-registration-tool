import { ApolloError } from '@apollo/client'
import { Typography } from '@mui/material'
import Error from 'next/error'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import {
  PackagingReportFinalDetailsQuery,
  Scalars,
  usePackagingReportFinalDetailsQuery,
} from '@/api/__types__'
import { ApolloErrorAlert } from '@/common/components/ApolloErrorAlert'
import { FormLayout } from '@/common/components/FormLayout'
import { LoadingState } from '@/common/components/LoadingState'

import { ForecastProvider } from './ForecastContext'
import { ForecastStepper } from './FormStepper'
import { ForecastData } from './types'
import { generateDefaultReportFormData } from './utils'

const useReportFinalDetails = (
  packagingReportId: string
): {
  defaultFormData: ForecastData | undefined
  loading: boolean
  error?: ApolloError
  fees?: Scalars['Float']
  packagingReport?: PackagingReportFinalDetailsQuery['packagingReport']
} => {
  const { data, loading, error } = usePackagingReportFinalDetailsQuery({
    variables: { packagingReportId: packagingReportId },
    // user will update this report, so it should be updated in the cache also after submit.
    fetchPolicy: 'cache-and-network',
  })

  const packagingReport = data?.packagingReport || undefined
  const report = packagingReport?.finalReport || undefined
  const fees = report?.fees || undefined

  // group materials by packagingGroup
  const defaultFormData: ForecastData | undefined = useMemo(
    () => generateDefaultReportFormData(packagingReport, report),
    [packagingReport, report]
  )

  return {
    defaultFormData,
    loading,
    error,
    fees,
    packagingReport,
  }
}
export type DataReportSection = Record<string, never>

export const DataReportSection = (_: DataReportSection): React.ReactElement => {
  // const { t } = useTranslation()

  const router = useRouter()
  const { id: packagingReportId } = router.query as { id: string }
  const {
    defaultFormData: finalReportDate,
    loading,
    error,
    packagingReport,
    fees,
  } = useReportFinalDetails(packagingReportId)

  return (
    <FormLayout>
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ApolloErrorAlert error={error} />
      ) : !packagingReport || !finalReportDate ? (
        <Error
          statusCode={404}
          title={
            'No Report found or Final Date report could not be found for this Packaging Report'
          }
        />
      ) : (
        <>
          <Typography
            component={'h1'}
            variant={'h4'}
            mb={{ xs: 8, sm: 10, md: 11 }}
          >
            {`Data Report No. ${packagingReportId}`}
          </Typography>
          <ForecastProvider
            defaultData={finalReportDate}
            fees={fees}
            packagingReportId={packagingReportId}
            isFinalReportSubmitted={packagingReport.isFinalReportSubmitted}
            isForecastEditable={packagingReport.isForecastEditable}
          >
            <ForecastStepper />
          </ForecastProvider>
        </>
      )}
    </FormLayout>
  )
}
