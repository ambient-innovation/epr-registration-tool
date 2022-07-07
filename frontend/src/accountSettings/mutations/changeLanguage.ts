import { gql } from '@apollo/client'

export const CHANGE_LANGUAGE = gql`
  mutation changeLanguage($languageCode: LanguageEnum!) {
    changeLanguage(languageCode: $languageCode)
  }
`
