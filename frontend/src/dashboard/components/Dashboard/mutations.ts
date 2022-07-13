import { gql } from '@apollo/client'

export const CHANGE_COMPANY_LOGO = gql`
  mutation changeCompanyLogo($file: Upload) {
    changeCompanyLogo(file: $file)
  }
`
