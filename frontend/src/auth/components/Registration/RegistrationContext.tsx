import { ApolloError } from '@apollo/client'
import { useRouter } from 'next/router'
import React, {
  useCallback,
  useContext,
  useState,
  useMemo,
  useEffect,
} from 'react'

import { useRegisterCompanyMutation } from '@/api/__types__'
import { ROUTES } from '@/routes'

import { RegistrationData } from './types'

const stepNumbers = [0, 1, 2] as const

export type StepNumber = (typeof stepNumbers)[number]

export const LAST_STEP_NUMBER = stepNumbers[stepNumbers.length - 1]

export interface RegistrationContextValue {
  data: RegistrationData
  initialData: RegistrationData
  goToPrevStep: () => void
  onSubmit: (data: Partial<RegistrationData>) => void
  activeStep: StepNumber
  error?: ApolloError
}

export const RegistrationContext =
  React.createContext<RegistrationContextValue | null>(null)
RegistrationContext.displayName = 'RegsitrationContext'

export const initialData: RegistrationData = {
  companyName: '',
  companyDistributorType: null,
  countryCode: '',
  // user
  userEmail: '',
  userTitle: '',
  userFullName: '',
  userPosition: '',
  userPhone: '',
  password: '',
}

export const RegistrationProvider: React.FC<{
  children?: React.ReactNode
}> = ({ children }) => {
  const router = useRouter()
  const [data, setData] = useState<RegistrationData>(initialData)
  const [activeStep, setActiveStep] = useState<StepNumber>(0)

  const [registerCompany, { error }] = useRegisterCompanyMutation()

  const onSubmit: RegistrationContextValue['onSubmit'] = useCallback(
    (updatedData) => {
      if (activeStep < LAST_STEP_NUMBER) {
        setData((prevData) => ({ ...prevData, ...updatedData }))
        setActiveStep((prevStep) => (prevStep + 1) as StepNumber)
      } else {
        const finalData = { ...data, ...updatedData }
        // important: return promise,
        // so react-hook-form `isSubmitting` state works correctly
        return (
          registerCompany({
            variables: {
              companyName: finalData.companyName,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              companyDistributorType: finalData.companyDistributorType!,
              countryCode: finalData.countryCode,
              userEmail: finalData.userEmail,
              userTitle: finalData.userTitle,
              userFullName: finalData.userFullName,
              userPosition: finalData.userPosition,
              userPhoneOrMobile: finalData.userPhone,
              password: finalData.password,
            },
          })
            .then(() => {
              router.push(ROUTES.registrationSuccess)
            })
            // handle error via error object returned by useMutation
            .catch(() => null)
        )
      }
    },
    [activeStep, router, data, registerCompany]
  )

  const goToPrevStep = useCallback(() => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => (prevStep - 1) as StepNumber)
    }
  }, [activeStep])

  const contextValue = useMemo<RegistrationContextValue>(
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
    <RegistrationContext.Provider value={contextValue}>
      {children}
    </RegistrationContext.Provider>
  )
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useRegistrationContext = () => useContext(RegistrationContext)!
