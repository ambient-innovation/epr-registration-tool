import { gql } from '@apollo/client'

export const COMPANY_DETAILS_WITH_CONTACT_INFO = gql`
  query companyDetailsWithContactInfo {
    companyDetails {
      id
      name
      distributorType
      identificationNumber
      isProfileCompleted
      countryCode
      contactInfo {
        postalCode
        streetNumber
        additionalAddressInfo
        city
        phoneNumber
        country
        street
      }
      additionalInvoiceRecipient {
        title
        fullName
        email
        phoneOrMobile
      }
    }
  }
`
