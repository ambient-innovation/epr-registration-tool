import { gql } from '@apollo/client'

export const CREATE_COMPANY_PROFILE = gql`
  mutation createCompanyProfile(
    $profileData: CompanyProfileInputType!
    $identificationNumber: String!
  ) {
    createCompanyProfile(
      profileData: $profileData
      identificationNumber: $identificationNumber
    )
  }
`
