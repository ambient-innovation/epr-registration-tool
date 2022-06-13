export interface CompanyProfileData {
  country: string
  postalCode?: string
  city: string
  street: string
  streetNumber?: string
  additionalAddressInfo?: string
  phoneNumber: string
  identificationNumber: string
}

export type CompanyProfileDataKey = keyof CompanyProfileData
