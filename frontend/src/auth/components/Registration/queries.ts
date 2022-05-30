import { gql } from '@apollo/client'

export const SECTORS_QUERY = gql`
  query companySectors {
    sectors {
      id
      name
      subsectors {
        id
        name
      }
    }
  }
`
