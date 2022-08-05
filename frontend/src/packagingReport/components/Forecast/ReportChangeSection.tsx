import { ApolloError } from '@apollo/client'
import { Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'
import Error from 'next/error'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import {
  PackagingReportForecastDetailsQuery,
  usePackagingReportForecastDetailsQuery,
} from '@/api/__types__'
import { ApolloErrorAlert } from '@/common/components/ApolloErrorAlert'
import { FormLayout } from '@/common/components/FormLayout'
import { LoadingState } from '@/common/components/LoadingState'
import { BackButton } from '@/common/components/backButton'
import { ROUTES } from '@/routes'

import { ForecastProvider } from './ForecastContext'
import { ForecastStepper } from './FormStepper'
import { ForecastData } from './types'
import { generateDefaultReportFormData } from './utils'

const useReportDetails = (
  packagingReportId: string
): {
  defaultFormData: ForecastData | undefined
  loading: boolean
  error?: ApolloError
  packagingReport?: PackagingReportForecastDetailsQuery['packagingReport']
} => {
  const { data, loading, error } = usePackagingReportForecastDetailsQuery({
    variables: { packagingReportId: packagingReportId },
    // user will update this report, so it should be updated in the cache also after submit.
    fetchPolicy: 'cache-and-network',
  })

  const packagingReport = data?.packagingReport || undefined
  const submission = packagingReport?.forecast || undefined

  // group materials by packagingGroup
  const defaultFormData: ForecastData | undefined = useMemo(
    () => generateDefaultReportFormData(packagingReport, submission),
    [packagingReport, submission]
  )

  return {
    defaultFormData,
    loading,
    error,
    packagingReport,
  }
}

export type ReportChangeSection = Record<string, never>

export const ReportChangeSection = (
  _: ReportChangeSection
): React.ReactElement => {
  const { t } = useTranslation()

  const router = useRouter()
  const { id: packagingReportId } = router.query as { id: string }
  const { defaultFormData, loading, error, packagingReport } =
    useReportDetails(packagingReportId)

  const isForecast = packagingReport?.isForecastEditable
  const isFinalReportSubmit =
    !packagingReport?.isFinalReportSubmitted &&
    !packagingReport?.isForecastEditable

  return (
    <FormLayout>
      <div>
        <BackButton
          url={ROUTES.dashboard}
          label={t('backToDashboard')}
          style={{
            marginBottom: { xs: 8, lg: 11 },
          }}
        />
      </div>
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ApolloErrorAlert error={error} />
      ) : !packagingReport || !defaultFormData ? (
        <Error statusCode={404} title={t('reportForm.reportNotFound')} />
      ) : (
        <>
          <Typography
            component={'h1'}
            variant={'h1'}
            mb={{ xs: 8, sm: 10, md: 11 }}
          >
            {isForecast
              ? t('reportForm.updateReportNoX', {
                  reportNo: packagingReportId,
                })
              : isFinalReportSubmit
              ? t('reportForm.submitActualQuantitiesForReportNoX', {
                  reportNo: packagingReportId,
                })
              : t('reportForm.reportNoX', {
                  reportNo: packagingReportId,
                })}
          </Typography>
          <ForecastProvider
            defaultData={defaultFormData}
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
