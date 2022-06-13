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
  TimeframeType,
  usePackagingReportSubmitMutation,
} from '@/api/__types__'
import { ROUTES } from '@/routes'
import { startOfNextMonth } from '@/utils/utils.date'

import { ForecastData } from './types'

const stepNumbers = [0, 1, 2] as const

export type StepNumber = typeof stepNumbers[number]

export const LAST_STEP_NUMBER = stepNumbers[stepNumbers.length - 1]

export interface ForecastContextValue {
  data: ForecastData
  initialData: ForecastData
  goToPrevStep: () => void
  onSubmit: (data: Partial<ForecastData>) => void
  activeStep: StepNumber
  error?: ApolloError
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
  children?: React.ReactNode
}> = ({ children }) => {
  const router = useRouter()
  const [data, setData] = useState<ForecastData>(initialData)
  const [activeStep, setActiveStep] = useState<StepNumber>(0)
  const [packagingReportSubmit, { error }] = usePackagingReportSubmitMutation()

  const onSubmit: ForecastContextValue['onSubmit'] = useCallback(
    (updatedData) => {
      if (activeStep < LAST_STEP_NUMBER) {
        setData((prevData) => ({ ...prevData, ...updatedData }))
        setActiveStep((prevStep) => (prevStep + 1) as StepNumber)
      } else {
        const { startDate, ...finalDate } = { ...data, ...updatedData }

        return (
          packagingReportSubmit({
            variables: {
              year: startDate.getFullYear(),
              startMonth: startDate.getMonth() + 1, // months start from 0 in javascript Date Api, they say, that because is copied from java.util.Date
              tzInfo: Intl.DateTimeFormat().resolvedOptions().timeZone,
              ...finalDate,
            },
          })
            .then(() => {
              router.push(ROUTES.forecastSuccess)
            })
            // handle error via error object returned by useMutation
            .catch(() => null)
        )
      }
    },
    [activeStep, router, data, packagingReportSubmit]
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
      initialData,
      error,
    }),
    [onSubmit, goToPrevStep, activeStep, data, error]
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
