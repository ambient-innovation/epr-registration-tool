export interface RegistrationData {
  companyName: string
  companyRegistrationNumber: string
  companySector: string
  companySubSector: string
  companyStreet: string
  companyAddressInfo: string
  companyZipCode: string
  companyCity: string
  companyCountry: string
  companyProvince: string
  companyEmail: string
  companyPhone: string
  companyMobile: string
  companyFax: string
  // user
  userEmail: string
  userTitle: string
  userFullName: string
  userPosition: string
  userPhone: string
  password: string
}

export type RegistrationDataKey = keyof RegistrationData
