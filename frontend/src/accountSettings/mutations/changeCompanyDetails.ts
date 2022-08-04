import { gql } from '@apollo/client'

export const CHANGE_COMPANY_DETAILS = gql`
  mutation changeCompanyDetails(
    $companyInput: CompanyInput!
    $contactInfoInput: CompanyContactInfoInput!
    $additionalInvoiceRecipientInput: AdditionalInvoiceRecipientInput
  ) {
    changeCompanyDetails(
      companyInput: $companyInput
      contactInfoInput: $contactInfoInput
      additionalInvoiceRecipientInput: $additionalInvoiceRecipientInput
    )
  }
`
