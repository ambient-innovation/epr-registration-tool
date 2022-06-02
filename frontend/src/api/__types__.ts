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
  /** Date with time (isoformat) */
  DateTime: any
  /** Decimal (fixed-point) */
  Decimal: any
}

export type CompanyType = {
  __typename?: 'CompanyType'
  createdAt: Scalars['DateTime']
  distributorType: Scalars['String']
  id: Scalars['ID']
  lastmodifiedAt: Scalars['DateTime']
  name: Scalars['String']
  registrationNumber: Scalars['String']
}

export enum DistributorType {
  IMPORTER = 'IMPORTER',
  LOCAL_PRODUCER = 'LOCAL_PRODUCER',
}

export type MaterialInput = {
  materialId: Scalars['ID']
  quantity: Scalars['Decimal']
}

export type MaterialType = {
  __typename?: 'MaterialType'
  id: Scalars['ID']
  name: Scalars['String']
  price: Scalars['Decimal']
}

export type Mutation = {
  __typename?: 'Mutation'
  packagingReportSubmit: Scalars['String']
  registerCompany: Scalars['String']
}

export type MutationPackagingReportSubmitArgs = {
  packagingRecords: Array<PackagingGroupInput>
  startMonth: Scalars['Int']
  timeframe: TimeframeType
  tzInfo: Scalars['String']
  year: Scalars['Int']
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

export type PackagingGroupInput = {
  materialRecords: Array<MaterialInput>
  packagingGroupId: Scalars['ID']
}

export type PackagingGroupType = {
  __typename?: 'PackagingGroupType'
  id: Scalars['ID']
  name: Scalars['String']
}

export type Query = {
  __typename?: 'Query'
  companyDetails?: Maybe<CompanyType>
  helloWorld: Scalars['String']
  me?: Maybe<UserType>
  packagingGroups: Array<PackagingGroupType>
  packagingMaterials: Array<MaterialType>
}

export enum TimeframeType {
  MONTH = 'MONTH',
  THREE_MONTHS = 'THREE_MONTHS',
  TWELVE_MONTHS = 'TWELVE_MONTHS',
}

export type UserType = {
  __typename?: 'UserType'
  email: Scalars['String']
  fullName: Scalars['String']
  id: Scalars['ID']
  title: Scalars['String']
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

export type MeQueryVariables = Exact<{ [key: string]: never }>

export type MeQuery = {
  __typename?: 'Query'
  me?: {
    __typename?: 'UserType'
    id: string
    email: string
    title: string
    fullName: string
  } | null
}

export type CompanyDetailsQueryVariables = Exact<{ [key: string]: never }>

export type CompanyDetailsQuery = {
  __typename?: 'Query'
  companyDetails?: {
    __typename?: 'CompanyType'
    id: string
    name: string
    distributorType: string
    registrationNumber: string
    createdAt: any
    lastmodifiedAt: any
  } | null
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
export const MeDocument = gql`
  query me {
    me {
      id
      email
      title
      fullName
    }
  }
`
export function useMeQuery(
  baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options)
}
export function useMeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options)
}
export type MeQueryHookResult = ReturnType<typeof useMeQuery>
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>
export const CompanyDetailsDocument = gql`
  query companyDetails {
    companyDetails {
      id
      name
      distributorType
      registrationNumber
      createdAt
      lastmodifiedAt
    }
  }
`
export function useCompanyDetailsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    CompanyDetailsQuery,
    CompanyDetailsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<CompanyDetailsQuery, CompanyDetailsQueryVariables>(
    CompanyDetailsDocument,
    options
  )
}
export function useCompanyDetailsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CompanyDetailsQuery,
    CompanyDetailsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<CompanyDetailsQuery, CompanyDetailsQueryVariables>(
    CompanyDetailsDocument,
    options
  )
}
export type CompanyDetailsQueryHookResult = ReturnType<
  typeof useCompanyDetailsQuery
>
export type CompanyDetailsLazyQueryHookResult = ReturnType<
  typeof useCompanyDetailsLazyQuery
>
export type CompanyDetailsQueryResult = Apollo.QueryResult<
  CompanyDetailsQuery,
  CompanyDetailsQueryVariables
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
