import { gql } from '@apollo/client'

export const ME = gql`
  query me {
    me {
      id
      email
      title
      fullName
    }
  }
`
