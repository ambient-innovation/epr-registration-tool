import { gql } from '@apollo/client'

export const ME = gql`
  query me {
    me {
      id
      email
      title
      fullName
      languagePreference
    }
  }
`

export const USER_ACCOUNT_DATA = gql`
  query userAccountData {
    me {
      id
      email
      title
      fullName
      phoneOrMobile
      position
      emailChangeRequest {
        createdAt
        email
        isValid
      }
    }
  }
`
