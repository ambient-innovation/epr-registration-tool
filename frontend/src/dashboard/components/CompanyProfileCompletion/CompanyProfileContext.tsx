import { ApolloError } from '@apollo/client'
import { useRouter } from 'next/router'
import React, {
  useCallback,
  useContext,
  useState,
  useMemo,
  useEffect,
} from 'react'

import { useCreateCompanyProfileMutation } from '@/api/__types__'
import { COMPANY_DETAILS } from '@/dashboard/components/Dashboard/queries'
import { ROUTES } from '@/routes'

import { CompanyProfileData } from './types'

const stepNumbers = [0] as const

export type StepNumber = typeof stepNumbers[number]

// export const LAST_STEP_NUMBER = stepNumbers[stepNumbers.length - 1]
export const LAST_STEP_NUMBER = 0

export interface CompanyProfileContextValue {
  data: CompanyProfileData
  initialData: CompanyProfileData
  goToPrevStep: () => void
  onSubmit: (data: Partial<CompanyProfileData>) => void
  activeStep: StepNumber
  error?: ApolloError
}

export const CompanyProfileContext =
  React.createContext<CompanyProfileContextValue | null>(null)
CompanyProfileContext.displayName = 'CompanyProfileContext'

export const initialData: CompanyProfileData = {
  country: '',
  postalCode: '',
  city: '',
  street: '',
  streetNumber: '',
  additionalAddressInfo: '',
  phoneNumber: '',
  identificationNumber: '',
}

export const CompanyProfileProvider: React.FC<{
  children?: React.ReactNode
}> = ({ children }) => {
  const router = useRouter()
  const [data, setData] = useState<CompanyProfileData>(initialData)
  const [activeStep, setActiveStep] = useState<StepNumber>(0)

  const [createCompanyProfile, { error }] = useCreateCompanyProfileMutation()

  const onSubmit: CompanyProfileContextValue['onSubmit'] = useCallback(
    (updatedData) => {
      if (activeStep < LAST_STEP_NUMBER) {
        setData((prevData) => ({ ...prevData, ...updatedData }))
        setActiveStep((prevStep) => (prevStep + 1) as StepNumber)
      } else {
        const finalData = { ...data, ...updatedData }
        const { identificationNumber, ...profileData } = finalData
        // important: return promise,
        // so react-hook-form `isSubmitting` state works correctly
        return (
          createCompanyProfile({
            variables: {
              identificationNumber: identificationNumber,
              profileData,
            },
            refetchQueries: [{ query: COMPANY_DETAILS }],
          })
            .then(() => {
              router.push(ROUTES.dashboard)
            })
            // handle error via error object returned by useMutation
            .catch(() => null)
        )
      }
    },
    [activeStep, router, data, createCompanyProfile]
  )

  const goToPrevStep = useCallback(() => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => (prevStep - 1) as StepNumber)
    }
  }, [activeStep])

  const contextValue = useMemo<CompanyProfileContextValue>(
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
    <CompanyProfileContext.Provider value={contextValue}>
      {children}
    </CompanyProfileContext.Provider>
  )
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useCompanyProfileContext = () => useContext(CompanyProfileContext)!
