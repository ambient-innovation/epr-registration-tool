import { DistributorType } from '@/api/__types__'

export interface RegistrationData {
  companyName: string
  companyDistributorType: null | DistributorType
  // user
  userEmail: string
  userTitle: string
  userFullName: string
  userPosition: string
  userPhone: string
  password: string
}

export type RegistrationDataKey = keyof RegistrationData
