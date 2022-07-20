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
        name
        path
        size
        url
      }
    }
  }
`
