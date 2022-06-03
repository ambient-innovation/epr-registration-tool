import { gql } from '@apollo/client'

export const COMPANY_DETAILS = gql`
  query companyDetails {
    companyDetails {
      id
      name
      distributorType
      registrationNumber
      createdAt
      lastmodifiedAt
    }
  }
`