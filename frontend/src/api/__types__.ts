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
  companyName: Scalars['String']
  password: Scalars['String']
  subsectorIds: Array<Scalars['Int']>
  userEmail: Scalars['String']
  userFullName: Scalars['String']
  userPhoneOrMobile: Scalars['String']
  userPosition: Scalars['String']
  userTitle: Scalars['String']
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

export type RegisterCompanyMutationVariables = Exact<{
  companyName: Scalars['String']
  subsectorIds: Array<Scalars['Int']> | Scalars['Int']
  userEmail: Scalars['String']
  userTitle: Scalars['String']
  userFullName: Scalars['String']
  userPosition: Scalars['String']
  userPhoneOrMobile: Scalars['String']
  password: Scalars['String']
}>

export type RegisterCompanyMutation = {
  __typename?: 'Mutation'
  registerCompany: string
}

export type CompanySectorsQueryVariables = Exact<{ [key: string]: never }>

export type CompanySectorsQuery = {
  __typename?: 'Query'
  sectors: Array<{
    __typename?: 'SectorType'
    id: string
    name: string
    subsectors: Array<{
      __typename?: 'SubsectorType'
      id: string
      name: string
    }>
  }>
}

export type ExampleQueryVariables = Exact<{ [key: string]: never }>

export type ExampleQuery = { __typename?: 'Query'; helloWorld: string }

export const RegisterCompanyDocument = gql`
  mutation registerCompany(
    $companyName: String!
    $subsectorIds: [Int!]!
    $userEmail: String!
    $userTitle: String!
    $userFullName: String!
    $userPosition: String!
    $userPhoneOrMobile: String!
    $password: String!
  ) {
    registerCompany(
      companyName: $companyName
      subsectorIds: $subsectorIds
      userEmail: $userEmail
      userTitle: $userTitle
      userFullName: $userFullName
      userPosition: $userPosition
      userPhoneOrMobile: $userPhoneOrMobile
      password: $password
    )
  }
`
export type RegisterCompanyMutationFn = Apollo.MutationFunction<
  RegisterCompanyMutation,
  RegisterCompanyMutationVariables
>
export function useRegisterCompanyMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RegisterCompanyMutation,
    RegisterCompanyMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    RegisterCompanyMutation,
    RegisterCompanyMutationVariables
  >(RegisterCompanyDocument, options)
}
export type RegisterCompanyMutationHookResult = ReturnType<
  typeof useRegisterCompanyMutation
>
export type RegisterCompanyMutationResult =
  Apollo.MutationResult<RegisterCompanyMutation>
export type RegisterCompanyMutationOptions = Apollo.BaseMutationOptions<
  RegisterCompanyMutation,
  RegisterCompanyMutationVariables
>
export const CompanySectorsDocument = gql`
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
export function useCompanySectorsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    CompanySectorsQuery,
    CompanySectorsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<CompanySectorsQuery, CompanySectorsQueryVariables>(
    CompanySectorsDocument,
    options
  )
}
export function useCompanySectorsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CompanySectorsQuery,
    CompanySectorsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<CompanySectorsQuery, CompanySectorsQueryVariables>(
    CompanySectorsDocument,
    options
  )
}
export type CompanySectorsQueryHookResult = ReturnType<
  typeof useCompanySectorsQuery
>
export type CompanySectorsLazyQueryHookResult = ReturnType<
  typeof useCompanySectorsLazyQuery
>
export type CompanySectorsQueryResult = Apollo.QueryResult<
  CompanySectorsQuery,
  CompanySectorsQueryVariables
>
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
