import { gql } from '@apollo/client'

export const COMPANY_DETAILS = gql`
  query companyDetails {
    companyDetails {
      id
      name
      registrationNumber
      distributorType
      identificationNumber
      createdAt
      lastmodifiedAt
      isProfileCompleted
      logo {
        url
      }
      contactInfo {
        postalCode
        streetNumber
        additionalAddressInfo
        city
        phoneNumber
        country
        street
      }
    }
  }
`
