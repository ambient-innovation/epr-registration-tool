export interface RegistrationData {
  companyName: string
  companySectorId: string
  companySubSectorIds: string[]
  // user
  userEmail: string
  userTitle: string
  userFullName: string
  userPosition: string
  userPhone: string
  password: string
}

export type RegistrationDataKey = keyof RegistrationData
