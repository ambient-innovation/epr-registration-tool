import { gql } from '@apollo/client'

export const CHANGE_ACCOUNT = gql`
  mutation changeAccount($accountData: UserChangeInputType!) {
    changeAccount(accountData: $accountData)
  }
`
