import { ApolloError } from '@apollo/client'
import { useRouter } from 'next/router'
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  Scalars,
  TimeframeType,
  usePackagingReportFinalDataSubmitMutation,
  usePackagingReportForecastSubmitMutation,
  usePackagingReportForecastUpdateMutation,
} from '@/api/__types__'
import { PACKAGING_REPORTS_QUERY } from '@/dashboard/components/ReportListSection/queries'
import { ROUTES } from '@/routes'
import { startOfNextMonth } from '@/utils/utils.date'

import { ForecastData } from './types'

const stepNumbers = [0, 1, 2] as const

export type StepNumber = (typeof stepNumbers)[number]

export const LAST_STEP_NUMBER = stepNumbers[stepNumbers.length - 1]

export interface ForecastContextValue {
  data: ForecastData
  initialData: ForecastData
  packagingReportId?: string
  isTimeframeReadonly: boolean
  isReadonlyForm: boolean
  goToPrevStep: () => void
  onSubmit: (data: Partial<ForecastData>) => void
  activeStep: StepNumber
  error?: ApolloError
  fees?: Scalars['Float']
}

export const ForecastContext = React.createContext<ForecastContextValue | null>(
  null
)
ForecastContext.displayName = 'ForecastContext'

export const initialData: ForecastData = {
  startDate: startOfNextMonth(),
  timeframe: TimeframeType.MONTH,
  packagingRecords: [
    {
      packagingGroupId: '',
      materialRecords: [{ materialId: '', quantity: 0 }],
    },
  ],
}

export const ForecastProvider: React.FC<{
  defaultData?: ForecastData
  packagingReportId?: string
  isForecastEditable?: boolean
  isFinalReportSubmitted?: boolean
  fees?: Scalars['Float']
  children?: React.ReactNode
}> = ({
  children,
  defaultData = initialData,
  isForecastEditable = true,
  isFinalReportSubmitted = false,
  fees,
  packagingReportId,
}) => {
  const router = useRouter()
  const [data, setData] = useState<ForecastData>(defaultData)
  const [activeStep, setActiveStep] = useState<StepNumber>(0)
  const readonly = isFinalReportSubmitted
  const [packagingReportSubmit, { error: createError }] =
    usePackagingReportForecastSubmitMutation({
      refetchQueries: [PACKAGING_REPORTS_QUERY],
    })
  const [packagingReportUpdate, { error: updateError }] =
    usePackagingReportForecastUpdateMutation({
      refetchQueries: [PACKAGING_REPORTS_QUERY],
    })

  const [packagingReportFinalDataSubmit, { error: submitFinalReportError }] =
    usePackagingReportFinalDataSubmitMutation({
      refetchQueries: [PACKAGING_REPORTS_QUERY],
    })

  const onSubmit: ForecastContextValue['onSubmit'] = useCallback(
    (updatedData) => {
      if (activeStep < LAST_STEP_NUMBER) {
        setData((prevData) => ({ ...prevData, ...updatedData }))
        setActiveStep((prevStep) => (prevStep + 1) as StepNumber)
      } else {
        if (readonly) {
          // read only form
          return
        }
        const { startDate, ...finalDate } = { ...data, ...updatedData }

        return packagingReportId && isForecastEditable
          ? // update forecast
            packagingReportUpdate({
              variables: {
                packagingReportId,
                packagingRecords: finalDate.packagingRecords,
              },
            })
              .then(() => {
                router.push(ROUTES.forecastUpdateSuccess(packagingReportId))
              })
              // handle error via error object returned by useMutation
              .catch(() => null)
          : packagingReportId && !isFinalReportSubmitted
          ? // packagingReportId exist and forcast is not editable this mean we are about final report
            // if final report is submitted this will rais a server error
            packagingReportFinalDataSubmit({
              variables: {
                packagingReportId,
                packagingRecords: finalDate.packagingRecords,
              },
            })
              .then(() => {
                router.push(ROUTES.finalReportSubmitSuccess(packagingReportId))
              })
              // handle error via error object returned by useMutation
              .catch(() => null)
          : packagingReportSubmit({
              variables: {
                year: startDate.getFullYear(),
                // months start from 0 in javascript Date Api, they say, that because is copied from java.util.Date
                startMonth: startDate.getMonth() + 1,
                tzInfo: Intl.DateTimeFormat().resolvedOptions().timeZone,
                ...finalDate,
              },
            })
              .then(() => {
                router.push(ROUTES.forecastSuccess)
              })
              // handle error via error object returned by useMutation
              .catch(() => null)
      }
    },
    [
      activeStep,
      router,
      data,
      packagingReportSubmit,
      packagingReportUpdate,
      packagingReportFinalDataSubmit,
      isFinalReportSubmitted,
      isForecastEditable,
      packagingReportId,
      readonly,
    ]
  )

  const goToPrevStep = useCallback(() => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => (prevStep - 1) as StepNumber)
    }
  }, [activeStep])
  const contextValue = useMemo(
    () => ({
      onSubmit,
      goToPrevStep,
      activeStep,
      data,
      initialData: defaultData ?? initialData,
      packagingReportId: packagingReportId,
      // the timeframe is not editable see #12
      isTimeframeReadonly: !!packagingReportId,
      // if both are false this mean it is read only form
      isReadonlyForm: readonly,
      error: createError || updateError || submitFinalReportError,
      fees,
    }),
    [
      onSubmit,
      packagingReportId,
      goToPrevStep,
      activeStep,
      data,
      createError,
      updateError,
      submitFinalReportError,
      defaultData,
      readonly,
      fees,
    ]
  )

  useEffect(() => {
    if (activeStep > 0) {
      window.scrollTo({ top: 180, behavior: 'smooth' })
    }
  }, [activeStep])

  return (
    <ForecastContext.Provider value={contextValue}>
      {children}
    </ForecastContext.Provider>
  )
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useForecastContext = () => useContext(ForecastContext)!
