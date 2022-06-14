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

export type CompanyProfileInputType = {
  additionalAddressInfo?: InputMaybe<Scalars['String']>
  city: Scalars['String']
  country: Scalars['String']
  phoneNumber: Scalars['String']
  postalCode?: InputMaybe<Scalars['String']>
  street: Scalars['String']
  streetNumber?: InputMaybe<Scalars['String']>
}

export type CompanyType = {
  __typename?: 'CompanyType'
  createdAt: Scalars['DateTime']
  distributorType: Scalars['String']
  id: Scalars['ID']
  identificationNumber: Scalars['String']
  isProfileCompleted: Scalars['Boolean']
  lastmodifiedAt: Scalars['DateTime']
  name: Scalars['String']
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
}

export type Mutation = {
  __typename?: 'Mutation'
  createCompanyProfile: Scalars['String']
  packagingReportSubmit: Scalars['String']
  registerCompany: Scalars['String']
}

export type MutationCreateCompanyProfileArgs = {
  identificationNumber: Scalars['String']
  profileData: CompanyProfileInputType
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

export type PackagingReportType = {
  __typename?: 'PackagingReportType'
  createdAt: Scalars['DateTime']
  id: Scalars['ID']
  packagingGroupsCount: Scalars['Int']
  startMonth: Scalars['Int']
  timeframe: Scalars['Int']
  timezoneInfo: Scalars['String']
  year: Scalars['Int']
}

export type Query = {
  __typename?: 'Query'
  companyDetails?: Maybe<CompanyType>
  helloWorld: Scalars['String']
  me?: Maybe<UserType>
  packagingGroups: Array<PackagingGroupType>
  packagingMaterials: Array<MaterialType>
  packagingReportFeesEstimation: Scalars['Decimal']
  packagingReports: Array<PackagingReportType>
}

export type QueryPackagingReportFeesEstimationArgs = {
  packagingRecords: Array<PackagingGroupInput>
  startMonth: Scalars['Int']
  timeframe: TimeframeType
  year: Scalars['Int']
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

export type CreateCompanyProfileMutationVariables = Exact<{
  profileData: CompanyProfileInputType
  identificationNumber: Scalars['String']
}>

export type CreateCompanyProfileMutation = {
  __typename?: 'Mutation'
  createCompanyProfile: string
}

export type CompanyDetailsQueryVariables = Exact<{ [key: string]: never }>

export type CompanyDetailsQuery = {
  __typename?: 'Query'
  companyDetails?: {
    __typename?: 'CompanyType'
    id: string
    name: string
    distributorType: string
    identificationNumber: string
    createdAt: any
    lastmodifiedAt: any
    isProfileCompleted: boolean
  } | null
}

export type PackagingReportsQueryVariables = Exact<{ [key: string]: never }>

export type PackagingReportsQuery = {
  __typename?: 'Query'
  packagingReports: Array<{
    __typename?: 'PackagingReportType'
    createdAt: any
    id: string
    startMonth: number
    year: number
    timezoneInfo: string
    timeframe: number
    packagingGroupsCount: number
  }>
}

export type ExampleQueryVariables = Exact<{ [key: string]: never }>

export type ExampleQuery = { __typename?: 'Query'; helloWorld: string }

export type PackagingReportSubmitMutationVariables = Exact<{
  year: Scalars['Int']
  startMonth: Scalars['Int']
  tzInfo: Scalars['String']
  timeframe: TimeframeType
  packagingRecords: Array<PackagingGroupInput> | PackagingGroupInput
}>

export type PackagingReportSubmitMutation = {
  __typename?: 'Mutation'
  packagingReportSubmit: string
}

export type PackagingBaseDataQueryVariables = Exact<{ [key: string]: never }>

export type PackagingBaseDataQuery = {
  __typename?: 'Query'
  packagingGroups: Array<{
    __typename?: 'PackagingGroupType'
    id: string
    name: string
  }>
  packagingMaterials: Array<{
    __typename?: 'MaterialType'
    id: string
    name: string
  }>
}

export type PackagingReportFeesEstimationQueryVariables = Exact<{
  year: Scalars['Int']
  startMonth: Scalars['Int']
  timeframe: TimeframeType
  packagingRecords: Array<PackagingGroupInput> | PackagingGroupInput
}>

export type PackagingReportFeesEstimationQuery = {
  __typename?: 'Query'
  fees: any
}

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
export const CreateCompanyProfileDocument = gql`
  mutation createCompanyProfile(
    $profileData: CompanyProfileInputType!
    $identificationNumber: String!
  ) {
    createCompanyProfile(
      profileData: $profileData
      identificationNumber: $identificationNumber
    )
  }
`
export type CreateCompanyProfileMutationFn = Apollo.MutationFunction<
  CreateCompanyProfileMutation,
  CreateCompanyProfileMutationVariables
>
export function useCreateCompanyProfileMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateCompanyProfileMutation,
    CreateCompanyProfileMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    CreateCompanyProfileMutation,
    CreateCompanyProfileMutationVariables
  >(CreateCompanyProfileDocument, options)
}
export type CreateCompanyProfileMutationHookResult = ReturnType<
  typeof useCreateCompanyProfileMutation
>
export type CreateCompanyProfileMutationResult =
  Apollo.MutationResult<CreateCompanyProfileMutation>
export type CreateCompanyProfileMutationOptions = Apollo.BaseMutationOptions<
  CreateCompanyProfileMutation,
  CreateCompanyProfileMutationVariables
>
export const CompanyDetailsDocument = gql`
  query companyDetails {
    companyDetails {
      id
      name
      distributorType
      identificationNumber
      createdAt
      lastmodifiedAt
      isProfileCompleted
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
export const PackagingReportsDocument = gql`
  query packagingReports {
    packagingReports {
      createdAt
      id
      startMonth
      year
      timezoneInfo
      timeframe
      packagingGroupsCount
    }
  }
`
export function usePackagingReportsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    PackagingReportsQuery,
    PackagingReportsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<PackagingReportsQuery, PackagingReportsQueryVariables>(
    PackagingReportsDocument,
    options
  )
}
export function usePackagingReportsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    PackagingReportsQuery,
    PackagingReportsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    PackagingReportsQuery,
    PackagingReportsQueryVariables
  >(PackagingReportsDocument, options)
}
export type PackagingReportsQueryHookResult = ReturnType<
  typeof usePackagingReportsQuery
>
export type PackagingReportsLazyQueryHookResult = ReturnType<
  typeof usePackagingReportsLazyQuery
>
export type PackagingReportsQueryResult = Apollo.QueryResult<
  PackagingReportsQuery,
  PackagingReportsQueryVariables
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
export const PackagingReportSubmitDocument = gql`
  mutation packagingReportSubmit(
    $year: Int!
    $startMonth: Int!
    $tzInfo: String!
    $timeframe: TimeframeType!
    $packagingRecords: [PackagingGroupInput!]!
  ) {
    packagingReportSubmit(
      year: $year
      startMonth: $startMonth
      tzInfo: $tzInfo
      timeframe: $timeframe
      packagingRecords: $packagingRecords
    )
  }
`
export type PackagingReportSubmitMutationFn = Apollo.MutationFunction<
  PackagingReportSubmitMutation,
  PackagingReportSubmitMutationVariables
>
export function usePackagingReportSubmitMutation(
  baseOptions?: Apollo.MutationHookOptions<
    PackagingReportSubmitMutation,
    PackagingReportSubmitMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    PackagingReportSubmitMutation,
    PackagingReportSubmitMutationVariables
  >(PackagingReportSubmitDocument, options)
}
export type PackagingReportSubmitMutationHookResult = ReturnType<
  typeof usePackagingReportSubmitMutation
>
export type PackagingReportSubmitMutationResult =
  Apollo.MutationResult<PackagingReportSubmitMutation>
export type PackagingReportSubmitMutationOptions = Apollo.BaseMutationOptions<
  PackagingReportSubmitMutation,
  PackagingReportSubmitMutationVariables
>
export const PackagingBaseDataDocument = gql`
  query packagingBaseData {
    packagingGroups {
      id
      name
    }
    packagingMaterials {
      id
      name
    }
  }
`
export function usePackagingBaseDataQuery(
  baseOptions?: Apollo.QueryHookOptions<
    PackagingBaseDataQuery,
    PackagingBaseDataQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<
    PackagingBaseDataQuery,
    PackagingBaseDataQueryVariables
  >(PackagingBaseDataDocument, options)
}
export function usePackagingBaseDataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    PackagingBaseDataQuery,
    PackagingBaseDataQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    PackagingBaseDataQuery,
    PackagingBaseDataQueryVariables
  >(PackagingBaseDataDocument, options)
}
export type PackagingBaseDataQueryHookResult = ReturnType<
  typeof usePackagingBaseDataQuery
>
export type PackagingBaseDataLazyQueryHookResult = ReturnType<
  typeof usePackagingBaseDataLazyQuery
>
export type PackagingBaseDataQueryResult = Apollo.QueryResult<
  PackagingBaseDataQuery,
  PackagingBaseDataQueryVariables
>
export const PackagingReportFeesEstimationDocument = gql`
  query packagingReportFeesEstimation(
    $year: Int!
    $startMonth: Int!
    $timeframe: TimeframeType!
    $packagingRecords: [PackagingGroupInput!]!
  ) {
    fees: packagingReportFeesEstimation(
      year: $year
      startMonth: $startMonth
      timeframe: $timeframe
      packagingRecords: $packagingRecords
    )
  }
`
export function usePackagingReportFeesEstimationQuery(
  baseOptions: Apollo.QueryHookOptions<
    PackagingReportFeesEstimationQuery,
    PackagingReportFeesEstimationQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<
    PackagingReportFeesEstimationQuery,
    PackagingReportFeesEstimationQueryVariables
  >(PackagingReportFeesEstimationDocument, options)
}
export function usePackagingReportFeesEstimationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    PackagingReportFeesEstimationQuery,
    PackagingReportFeesEstimationQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    PackagingReportFeesEstimationQuery,
    PackagingReportFeesEstimationQueryVariables
  >(PackagingReportFeesEstimationDocument, options)
}
export type PackagingReportFeesEstimationQueryHookResult = ReturnType<
  typeof usePackagingReportFeesEstimationQuery
>
export type PackagingReportFeesEstimationLazyQueryHookResult = ReturnType<
  typeof usePackagingReportFeesEstimationLazyQuery
>
export type PackagingReportFeesEstimationQueryResult = Apollo.QueryResult<
  PackagingReportFeesEstimationQuery,
  PackagingReportFeesEstimationQueryVariables
>
