import { useRouter } from 'next/router'
import React, {
  useCallback,
  useContext,
  useState,
  useMemo,
  useEffect,
} from 'react'

import { ROUTES } from '@/routes'

import { RegistrationData } from './types'

const stepNumbers = [0, 1, 2, 3] as const

export type StepNumber = typeof stepNumbers[number]

export const LAST_STEP_NUMBER = stepNumbers[stepNumbers.length - 1]

export interface RegistrationContextType {
  data: RegistrationData
  goToPrevStep: () => void
  onSubmit: (data: Partial<RegistrationData>) => void
  activeStep: StepNumber
  isLoading: boolean
}

export const RegistrationContext =
  React.createContext<RegistrationContextType | null>(null)
RegistrationContext.displayName = 'RegsitrationContext'

export const initialData: RegistrationData = {
  companyName: '',
  companyRegistrationNumber: '',
  companySector: '',
  companySubSector: '',
  companyStreet: '',
  companyAddressInfo: '',
  companyZipCode: '',
  companyCity: '',
  companyCountry: '',
  companyProvince: '',
  companyEmail: '',
  companyPhone: '',
  companyMobile: '',
  companyFax: '',
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
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit: RegistrationContextType['onSubmit'] = useCallback(
    (updatedData) => {
      setData((prevData) => ({ ...prevData, ...updatedData }))
      if (activeStep < LAST_STEP_NUMBER) {
        setActiveStep((prevStep) => (prevStep + 1) as StepNumber)
      } else {
        setIsLoading(true)
        new Promise((res) => setTimeout(res, 2000)).then(() => {
          router.push(ROUTES.registrationSuccess)
        })
      }
    },
    [activeStep, router]
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
      isLoading,
    }),
    [onSubmit, goToPrevStep, activeStep, data, isLoading]
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
