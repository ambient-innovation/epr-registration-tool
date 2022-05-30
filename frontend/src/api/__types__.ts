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

export enum DistributorType {
  IMPORTER = 'IMPORTER',
  LOCAL_PRODUCER = 'LOCAL_PRODUCER',
}

export type Mutation = {
  __typename?: 'Mutation'
  registerCompany: Scalars['String']
}

export type MutationRegisterCompanyArgs = {
  companyDistributorType: DistributorType
  companyName: Scalars['String']
  password: Scalars['String']
  userEmail: Scalars['String']
  userFullName: Scalars['String']
  userPhoneOrMobile: Scalars['String']
  userPosition: Scalars['String']
  userTitle: Scalars['String']
}

export type Query = {
  __typename?: 'Query'
  helloWorld: Scalars['String']
}

export type RegisterCompanyMutationVariables = Exact<{
  companyName: Scalars['String']
  companyDistributorType: DistributorType
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

export type ExampleQueryVariables = Exact<{ [key: string]: never }>

export type ExampleQuery = { __typename?: 'Query'; helloWorld: string }

export const RegisterCompanyDocument = gql`
  mutation registerCompany(
    $companyName: String!
    $companyDistributorType: DistributorType!
    $userEmail: String!
    $userTitle: String!
    $userFullName: String!
    $userPosition: String!
    $userPhoneOrMobile: String!
    $password: String!
  ) {
    registerCompany(
      companyName: $companyName
      companyDistributorType: $companyDistributorType
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
