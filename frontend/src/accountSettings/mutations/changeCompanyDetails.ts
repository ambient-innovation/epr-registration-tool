import { gql } from '@apollo/client'

export const CHANGE_COMPANY_DETAILS = gql`
  mutation changeCompanyDetails(
    $companyInput: CompanyInput!
    $contactInfoInput: CompanyContactInfoInput!
  ) {
    changeCompanyDetails(
      companyInput: $companyInput
      contactInfoInput: $contactInfoInput
    )
  }
`
