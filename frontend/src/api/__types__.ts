import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
const defaultOptions = {} as const
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type Mutation = {
  __typename?: 'Mutation'
  registerCompany: Scalars['String']
}

export type MutationRegisterCompanyArgs = {
  additionalAddressInfo: Scalars['String']
  city: Scalars['String']
  companyEmail: Scalars['String']
  country: Scalars['String']
  fax?: InputMaybe<Scalars['String']>
  fullName: Scalars['String']
  mobile?: InputMaybe<Scalars['String']>
  name: Scalars['String']
  password: Scalars['String']
  phone: Scalars['String']
  phoneOrMobile: Scalars['String']
  position: Scalars['String']
  province: Scalars['String']
  registrationNumber: Scalars['Int']
  streetAndNumber: Scalars['String']
  subsectorIds: Array<Scalars['Int']>
  title?: InputMaybe<Scalars['String']>
  userEmail: Scalars['String']
  zipCode?: InputMaybe<Scalars['Int']>
}

export type Query = {
  __typename?: 'Query'
  helloWorld: Scalars['String']
  sectors: Array<SectorType>
}

export type SectorType = {
  __typename?: 'SectorType'
  id: Scalars['ID']
  name: Scalars['String']
  subsectors: Array<SubsectorType>
}

export type SubsectorType = {
  __typename?: 'SubsectorType'
  id: Scalars['ID']
  name: Scalars['String']
}

export type ExampleQueryVariables = Exact<{ [key: string]: never }>

export type ExampleQuery = { __typename?: 'Query'; helloWorld: string }

export const ExampleDocument = gql`
  query example {
    helloWorld
  }
`
export function useExampleQuery(
  baseOptions?: Apollo.QueryHookOptions<ExampleQuery, ExampleQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<ExampleQuery, ExampleQueryVariables>(
    ExampleDocument,
    options
  )
}
export function useExampleLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ExampleQuery, ExampleQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<ExampleQuery, ExampleQueryVariables>(
    ExampleDocument,
    options
  )
}
export type ExampleQueryHookResult = ReturnType<typeof useExampleQuery>
export type ExampleLazyQueryHookResult = ReturnType<typeof useExampleLazyQuery>
export type ExampleQueryResult = Apollo.QueryResult<
  ExampleQuery,
  ExampleQueryVariables
>
