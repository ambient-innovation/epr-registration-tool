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
  Upload: any
}

export type AdditionalInvoiceRecipientInput = {
  email: Scalars['String']
  fullName: Scalars['String']
  phoneOrMobile?: InputMaybe<Scalars['String']>
  title?: InputMaybe<Scalars['String']>
}

export type AdditionalInvoiceRecipientType = {
  __typename?: 'AdditionalInvoiceRecipientType'
  email: Scalars['String']
  fullName: Scalars['String']
  phoneOrMobile: Scalars['String']
  title: Scalars['String']
}

export type CompanyContactInfoInput = {
  additionalAddressInfo?: InputMaybe<Scalars['String']>
  city: Scalars['String']
  country: Scalars['String']
  phoneNumber: Scalars['String']
  postalCode?: InputMaybe<Scalars['String']>
  street: Scalars['String']
  streetNumber?: InputMaybe<Scalars['String']>
}

export type CompanyContactInfoType = {
  __typename?: 'CompanyContactInfoType'
  additionalAddressInfo?: Maybe<Scalars['String']>
  city: Scalars['String']
  country: Scalars['String']
  phoneNumber: Scalars['String']
  postalCode?: Maybe<Scalars['String']>
  street: Scalars['String']
  streetNumber?: Maybe<Scalars['String']>
}

export type CompanyInput = {
  distributorType: DistributorType
  identificationNumber?: InputMaybe<Scalars['String']>
  name: Scalars['String']
}

export type CompanyType = {
  __typename?: 'CompanyType'
  additionalInvoiceRecipient?: Maybe<AdditionalInvoiceRecipientType>
  contactInfo?: Maybe<CompanyContactInfoType>
  createdAt: Scalars['DateTime']
  distributorType: DistributorType
  id: Scalars['ID']
  identificationNumber: Scalars['String']
  isProfileCompleted: Scalars['Boolean']
  lastmodifiedAt: Scalars['DateTime']
  logo?: Maybe<ImageType>
  name: Scalars['String']
  registrationNumber: Scalars['String']
}

export type CompanyTypeAdditionalInvoiceRecipientArgs = {
  pk?: InputMaybe<Scalars['ID']>
}

export type CompanyTypeContactInfoArgs = {
  pk?: InputMaybe<Scalars['ID']>
}

export enum DistributorType {
  IMPORTER = 'IMPORTER',
  LOCAL_PRODUCER = 'LOCAL_PRODUCER',
}

export type DjangoFileType = {
  __typename?: 'DjangoFileType'
  name: Scalars['String']
  path: Scalars['String']
  size: Scalars['Int']
  url: Scalars['String']
}

export type EmailChangeRequestType = {
  __typename?: 'EmailChangeRequestType'
  createdAt: Scalars['DateTime']
  email: Scalars['String']
  isValid: Scalars['Boolean']
}

export type FinalSubmissionType = {
  __typename?: 'FinalSubmissionType'
  fees: Scalars['Float']
  id: Scalars['ID']
  materialRecords: Array<MaterialRecordType>
}

export type ForecastSubmissionType = {
  __typename?: 'ForecastSubmissionType'
  id: Scalars['ID']
  materialRecords: Array<MaterialRecordType>
}

export type ImageType = {
  __typename?: 'ImageType'
  height: Scalars['Int']
  name: Scalars['String']
  size: Scalars['Int']
  url: Scalars['String']
  width: Scalars['Int']
}

export enum LanguageEnum {
  ar = 'ar',
  en = 'en',
}

export type MaterialInput = {
  materialId: Scalars['ID']
  quantity: Scalars['Decimal']
}

export type MaterialRecordType = {
  __typename?: 'MaterialRecordType'
  id: Scalars['ID']
  material: MaterialType
  packagingGroup: PackagingGroupType
  quantity: Scalars['Float']
}

export type MaterialType = {
  __typename?: 'MaterialType'
  id: Scalars['ID']
  name: Scalars['String']
}

export type Mutation = {
  __typename?: 'Mutation'
  changeAccount: Scalars['String']
  changeCompanyDetails: Scalars['String']
  changeCompanyLogo: Scalars['String']
  changeLanguage: Scalars['String']
  changePassword: Scalars['String']
  packagingReportFinalDataSubmit: Scalars['String']
  packagingReportForecastSubmit: Scalars['String']
  packagingReportForecastUpdate: Scalars['String']
  registerCompany: Scalars['String']
}

export type MutationChangeAccountArgs = {
  accountData: UserChangeInputType
}

export type MutationChangeCompanyDetailsArgs = {
  additionalInvoiceRecipientInput?: InputMaybe<AdditionalInvoiceRecipientInput>
  companyInput: CompanyInput
  contactInfoInput: CompanyContactInfoInput
}

export type MutationChangeCompanyLogoArgs = {
  file?: InputMaybe<Scalars['Upload']>
}

export type MutationChangeLanguageArgs = {
  languageCode: LanguageEnum
}

export type MutationChangePasswordArgs = {
  newPassword: Scalars['String']
  oldPassword: Scalars['String']
}

export type MutationPackagingReportFinalDataSubmitArgs = {
  packagingRecords: Array<PackagingGroupInput>
  packagingReportId: Scalars['ID']
}

export type MutationPackagingReportForecastSubmitArgs = {
  packagingRecords: Array<PackagingGroupInput>
  startMonth: Scalars['Int']
  timeframe: TimeframeType
  tzInfo: Scalars['String']
  year: Scalars['Int']
}

export type MutationPackagingReportForecastUpdateArgs = {
  packagingRecords: Array<PackagingGroupInput>
  packagingReportId: Scalars['ID']
}

export type MutationRegisterCompanyArgs = {
  companyDistributorType: DistributorType
  companyName: Scalars['String']
  countryCode: Scalars['String']
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
  endDatetime: Scalars['DateTime']
  fees?: Maybe<Scalars['Decimal']>
  finalReport?: Maybe<FinalSubmissionType>
  forecast?: Maybe<ForecastSubmissionType>
  id: Scalars['ID']
  invoiceFile?: Maybe<DjangoFileType>
  isFinalReportSubmitted: Scalars['Boolean']
  isForecastEditable: Scalars['Boolean']
  packagingGroupsCount: Scalars['Int']
  startMonth: Scalars['Int']
  timeframe: TimeframeType
  timezoneInfo: Scalars['String']
  year: Scalars['Int']
}

export type PackagingReportTypePaginationResult = {
  __typename?: 'PackagingReportTypePaginationResult'
  items: Array<PackagingReportType>
  pageInfo: PaginatorType
}

export type PackagingReportsFilterInput = {
  year?: InputMaybe<Scalars['Int']>
}

export enum PackagingReportsSortingOption {
  NEWEST_FIRST = 'NEWEST_FIRST',
  OLDEST_FIRST = 'OLDEST_FIRST',
}

export type PaginationInput = {
  limit: Scalars['Int']
  page: Scalars['Int']
}

export type PaginatorType = {
  __typename?: 'PaginatorType'
  currentPage: Scalars['Int']
  hasNextPage: Scalars['Boolean']
  numPages: Scalars['Int']
  perPage: Scalars['Int']
  totalCount: Scalars['Int']
}

export type Query = {
  __typename?: 'Query'
  companyDetails?: Maybe<CompanyType>
  helloWorld: Scalars['String']
  me?: Maybe<UserType>
  packagingGroups: Array<PackagingGroupType>
  packagingMaterials: Array<MaterialType>
  packagingReportFeesEstimation: Scalars['Decimal']
  packagingReportFinalDetails?: Maybe<PackagingReportType>
  packagingReportForecastDetails?: Maybe<PackagingReportType>
  packagingReports: PackagingReportTypePaginationResult
}

export type QueryPackagingReportFeesEstimationArgs = {
  packagingRecords: Array<PackagingGroupInput>
  startMonth: Scalars['Int']
  timeframe: TimeframeType
  year: Scalars['Int']
}

export type QueryPackagingReportFinalDetailsArgs = {
  packagingReportId: Scalars['ID']
}

export type QueryPackagingReportForecastDetailsArgs = {
  packagingReportId: Scalars['ID']
}

export type QueryPackagingReportsArgs = {
  filter?: InputMaybe<PackagingReportsFilterInput>
  pagination?: InputMaybe<PaginationInput>
  sorting?: InputMaybe<PackagingReportsSortingOption>
}

export enum TimeframeType {
  MONTH = 'MONTH',
  THREE_MONTHS = 'THREE_MONTHS',
  TWELVE_MONTHS = 'TWELVE_MONTHS',
}

export type UserChangeInputType = {
  email: Scalars['String']
  fullName: Scalars['String']
  phoneOrMobile?: InputMaybe<Scalars['String']>
  position?: InputMaybe<Scalars['String']>
  title?: InputMaybe<Scalars['String']>
}

export type UserType = {
  __typename?: 'UserType'
  email: Scalars['String']
  emailChangeRequest?: Maybe<EmailChangeRequestType>
  fullName: Scalars['String']
  id: Scalars['ID']
  languagePreference: LanguageEnum
  phoneOrMobile: Scalars['String']
  position: Scalars['String']
  title: Scalars['String']
}

export type CompanyDetailsWithContactInfoQueryVariables = Exact<{
  [key: string]: never
}>

export type CompanyDetailsWithContactInfoQuery = {
  __typename?: 'Query'
  companyDetails?: {
    __typename?: 'CompanyType'
    id: string
    name: string
    distributorType: DistributorType
    identificationNumber: string
    contactInfo?: {
      __typename?: 'CompanyContactInfoType'
      postalCode?: string | null
      streetNumber?: string | null
      additionalAddressInfo?: string | null
      city: string
      phoneNumber: string
      country: string
      street: string
    } | null
    additionalInvoiceRecipient?: {
      __typename?: 'AdditionalInvoiceRecipientType'
      title: string
      fullName: string
      email: string
      phoneOrMobile: string
    } | null
  } | null
}

export type ChangeAccountMutationVariables = Exact<{
  accountData: UserChangeInputType
}>

export type ChangeAccountMutation = {
  __typename?: 'Mutation'
  changeAccount: string
}

export type ChangeCompanyDetailsMutationVariables = Exact<{
  companyInput: CompanyInput
  contactInfoInput: CompanyContactInfoInput
  additionalInvoiceRecipientInput?: InputMaybe<AdditionalInvoiceRecipientInput>
}>

export type ChangeCompanyDetailsMutation = {
  __typename?: 'Mutation'
  changeCompanyDetails: string
}

export type ChangeLanguageMutationVariables = Exact<{
  languageCode: LanguageEnum
}>

export type ChangeLanguageMutation = {
  __typename?: 'Mutation'
  changeLanguage: string
}

export type ChangePasswordMutationVariables = Exact<{
  oldPassword: Scalars['String']
  newPassword: Scalars['String']
}>

export type ChangePasswordMutation = {
  __typename?: 'Mutation'
  changePassword: string
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
  countryCode: Scalars['String']
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
    languagePreference: LanguageEnum
  } | null
}

export type UserAccountDataQueryVariables = Exact<{ [key: string]: never }>

export type UserAccountDataQuery = {
  __typename?: 'Query'
  me?: {
    __typename?: 'UserType'
    id: string
    email: string
    title: string
    fullName: string
    phoneOrMobile: string
    position: string
    emailChangeRequest?: {
      __typename?: 'EmailChangeRequestType'
      createdAt: any
      email: string
      isValid: boolean
    } | null
  } | null
}

export type ChangeCompanyLogoMutationVariables = Exact<{
  file?: InputMaybe<Scalars['Upload']>
}>

export type ChangeCompanyLogoMutation = {
  __typename?: 'Mutation'
  changeCompanyLogo: string
}

export type CompanyDetailsQueryVariables = Exact<{ [key: string]: never }>

export type CompanyDetailsQuery = {
  __typename?: 'Query'
  companyDetails?: {
    __typename?: 'CompanyType'
    id: string
    name: string
    registrationNumber: string
    distributorType: DistributorType
    identificationNumber: string
    createdAt: any
    lastmodifiedAt: any
    isProfileCompleted: boolean
    logo?: { __typename?: 'ImageType'; url: string } | null
    contactInfo?: {
      __typename?: 'CompanyContactInfoType'
      postalCode?: string | null
      streetNumber?: string | null
      additionalAddressInfo?: string | null
      city: string
      phoneNumber: string
      country: string
      street: string
    } | null
  } | null
}

export type PackagingReportsQueryVariables = Exact<{
  pagination: PaginationInput
  filter: PackagingReportsFilterInput
  sorting: PackagingReportsSortingOption
}>

export type PackagingReportsQuery = {
  __typename?: 'Query'
  packagingReports: {
    __typename?: 'PackagingReportTypePaginationResult'
    items: Array<{
      __typename?: 'PackagingReportType'
      id: string
      createdAt: any
      startMonth: number
      year: number
      timezoneInfo: string
      timeframe: TimeframeType
      packagingGroupsCount: number
      isForecastEditable: boolean
      isFinalReportSubmitted: boolean
      endDatetime: any
      fees?: any | null
      invoiceFile?: { __typename?: 'DjangoFileType'; url: string } | null
    }>
    pageInfo: {
      __typename?: 'PaginatorType'
      perPage: number
      currentPage: number
      numPages: number
      totalCount: number
      hasNextPage: boolean
    }
  }
}

export type PackagingReportForecastSubmitMutationVariables = Exact<{
  year: Scalars['Int']
  startMonth: Scalars['Int']
  tzInfo: Scalars['String']
  timeframe: TimeframeType
  packagingRecords: Array<PackagingGroupInput> | PackagingGroupInput
}>

export type PackagingReportForecastSubmitMutation = {
  __typename?: 'Mutation'
  packagingReportForecastSubmit: string
}

export type PackagingReportForecastUpdateMutationVariables = Exact<{
  packagingReportId: Scalars['ID']
  packagingRecords: Array<PackagingGroupInput> | PackagingGroupInput
}>

export type PackagingReportForecastUpdateMutation = {
  __typename?: 'Mutation'
  packagingReportForecastUpdate: string
}

export type PackagingReportFinalDataSubmitMutationVariables = Exact<{
  packagingReportId: Scalars['ID']
  packagingRecords: Array<PackagingGroupInput> | PackagingGroupInput
}>

export type PackagingReportFinalDataSubmitMutation = {
  __typename?: 'Mutation'
  packagingReportFinalDataSubmit: string
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

export type PackagingReportForecastDetailsQueryVariables = Exact<{
  packagingReportId: Scalars['ID']
}>

export type PackagingReportForecastDetailsQuery = {
  __typename?: 'Query'
  packagingReport?: {
    __typename?: 'PackagingReportType'
    id: string
    timeframe: TimeframeType
    year: number
    startMonth: number
    timezoneInfo: string
    isForecastEditable: boolean
    isFinalReportSubmitted: boolean
    forecast?: {
      __typename?: 'ForecastSubmissionType'
      id: string
      materialRecords: Array<{
        __typename?: 'MaterialRecordType'
        id: string
        quantity: number
        packagingGroup: {
          __typename?: 'PackagingGroupType'
          id: string
          name: string
        }
        material: { __typename?: 'MaterialType'; id: string; name: string }
      }>
    } | null
  } | null
}

export type PackagingReportFinalDetailsQueryVariables = Exact<{
  packagingReportId: Scalars['ID']
}>

export type PackagingReportFinalDetailsQuery = {
  __typename?: 'Query'
  packagingReport?: {
    __typename?: 'PackagingReportType'
    id: string
    timeframe: TimeframeType
    year: number
    startMonth: number
    timezoneInfo: string
    isForecastEditable: boolean
    isFinalReportSubmitted: boolean
    finalReport?: {
      __typename?: 'FinalSubmissionType'
      id: string
      fees: number
      materialRecords: Array<{
        __typename?: 'MaterialRecordType'
        id: string
        quantity: number
        packagingGroup: {
          __typename?: 'PackagingGroupType'
          id: string
          name: string
        }
        material: { __typename?: 'MaterialType'; id: string; name: string }
      }>
    } | null
  } | null
}

export const CompanyDetailsWithContactInfoDocument = gql`
  query companyDetailsWithContactInfo {
    companyDetails {
      id
      name
      distributorType
      identificationNumber
      contactInfo {
        postalCode
        streetNumber
        additionalAddressInfo
        city
        phoneNumber
        country
        street
      }
      additionalInvoiceRecipient {
        title
        fullName
        email
        phoneOrMobile
      }
    }
  }
`
export function useCompanyDetailsWithContactInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<
    CompanyDetailsWithContactInfoQuery,
    CompanyDetailsWithContactInfoQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<
    CompanyDetailsWithContactInfoQuery,
    CompanyDetailsWithContactInfoQueryVariables
  >(CompanyDetailsWithContactInfoDocument, options)
}
export function useCompanyDetailsWithContactInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CompanyDetailsWithContactInfoQuery,
    CompanyDetailsWithContactInfoQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    CompanyDetailsWithContactInfoQuery,
    CompanyDetailsWithContactInfoQueryVariables
  >(CompanyDetailsWithContactInfoDocument, options)
}
export type CompanyDetailsWithContactInfoQueryHookResult = ReturnType<
  typeof useCompanyDetailsWithContactInfoQuery
>
export type CompanyDetailsWithContactInfoLazyQueryHookResult = ReturnType<
  typeof useCompanyDetailsWithContactInfoLazyQuery
>
export type CompanyDetailsWithContactInfoQueryResult = Apollo.QueryResult<
  CompanyDetailsWithContactInfoQuery,
  CompanyDetailsWithContactInfoQueryVariables
>
export const ChangeAccountDocument = gql`
  mutation changeAccount($accountData: UserChangeInputType!) {
    changeAccount(accountData: $accountData)
  }
`
export type ChangeAccountMutationFn = Apollo.MutationFunction<
  ChangeAccountMutation,
  ChangeAccountMutationVariables
>
export function useChangeAccountMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ChangeAccountMutation,
    ChangeAccountMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    ChangeAccountMutation,
    ChangeAccountMutationVariables
  >(ChangeAccountDocument, options)
}
export type ChangeAccountMutationHookResult = ReturnType<
  typeof useChangeAccountMutation
>
export type ChangeAccountMutationResult =
  Apollo.MutationResult<ChangeAccountMutation>
export type ChangeAccountMutationOptions = Apollo.BaseMutationOptions<
  ChangeAccountMutation,
  ChangeAccountMutationVariables
>
export const ChangeCompanyDetailsDocument = gql`
  mutation changeCompanyDetails(
    $companyInput: CompanyInput!
    $contactInfoInput: CompanyContactInfoInput!
    $additionalInvoiceRecipientInput: AdditionalInvoiceRecipientInput
  ) {
    changeCompanyDetails(
      companyInput: $companyInput
      contactInfoInput: $contactInfoInput
      additionalInvoiceRecipientInput: $additionalInvoiceRecipientInput
    )
  }
`
export type ChangeCompanyDetailsMutationFn = Apollo.MutationFunction<
  ChangeCompanyDetailsMutation,
  ChangeCompanyDetailsMutationVariables
>
export function useChangeCompanyDetailsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ChangeCompanyDetailsMutation,
    ChangeCompanyDetailsMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    ChangeCompanyDetailsMutation,
    ChangeCompanyDetailsMutationVariables
  >(ChangeCompanyDetailsDocument, options)
}
export type ChangeCompanyDetailsMutationHookResult = ReturnType<
  typeof useChangeCompanyDetailsMutation
>
export type ChangeCompanyDetailsMutationResult =
  Apollo.MutationResult<ChangeCompanyDetailsMutation>
export type ChangeCompanyDetailsMutationOptions = Apollo.BaseMutationOptions<
  ChangeCompanyDetailsMutation,
  ChangeCompanyDetailsMutationVariables
>
export const ChangeLanguageDocument = gql`
  mutation changeLanguage($languageCode: LanguageEnum!) {
    changeLanguage(languageCode: $languageCode)
  }
`
export type ChangeLanguageMutationFn = Apollo.MutationFunction<
  ChangeLanguageMutation,
  ChangeLanguageMutationVariables
>
export function useChangeLanguageMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ChangeLanguageMutation,
    ChangeLanguageMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    ChangeLanguageMutation,
    ChangeLanguageMutationVariables
  >(ChangeLanguageDocument, options)
}
export type ChangeLanguageMutationHookResult = ReturnType<
  typeof useChangeLanguageMutation
>
export type ChangeLanguageMutationResult =
  Apollo.MutationResult<ChangeLanguageMutation>
export type ChangeLanguageMutationOptions = Apollo.BaseMutationOptions<
  ChangeLanguageMutation,
  ChangeLanguageMutationVariables
>
export const ChangePasswordDocument = gql`
  mutation changePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(oldPassword: $oldPassword, newPassword: $newPassword)
  }
`
export type ChangePasswordMutationFn = Apollo.MutationFunction<
  ChangePasswordMutation,
  ChangePasswordMutationVariables
>
export function useChangePasswordMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ChangePasswordMutation,
    ChangePasswordMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    ChangePasswordMutation,
    ChangePasswordMutationVariables
  >(ChangePasswordDocument, options)
}
export type ChangePasswordMutationHookResult = ReturnType<
  typeof useChangePasswordMutation
>
export type ChangePasswordMutationResult =
  Apollo.MutationResult<ChangePasswordMutation>
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<
  ChangePasswordMutation,
  ChangePasswordMutationVariables
>
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
    $countryCode: String!
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
      countryCode: $countryCode
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
      languagePreference
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
export const UserAccountDataDocument = gql`
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
export function useUserAccountDataQuery(
  baseOptions?: Apollo.QueryHookOptions<
    UserAccountDataQuery,
    UserAccountDataQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<UserAccountDataQuery, UserAccountDataQueryVariables>(
    UserAccountDataDocument,
    options
  )
}
export function useUserAccountDataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    UserAccountDataQuery,
    UserAccountDataQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    UserAccountDataQuery,
    UserAccountDataQueryVariables
  >(UserAccountDataDocument, options)
}
export type UserAccountDataQueryHookResult = ReturnType<
  typeof useUserAccountDataQuery
>
export type UserAccountDataLazyQueryHookResult = ReturnType<
  typeof useUserAccountDataLazyQuery
>
export type UserAccountDataQueryResult = Apollo.QueryResult<
  UserAccountDataQuery,
  UserAccountDataQueryVariables
>
export const ChangeCompanyLogoDocument = gql`
  mutation changeCompanyLogo($file: Upload) {
    changeCompanyLogo(file: $file)
  }
`
export type ChangeCompanyLogoMutationFn = Apollo.MutationFunction<
  ChangeCompanyLogoMutation,
  ChangeCompanyLogoMutationVariables
>
export function useChangeCompanyLogoMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ChangeCompanyLogoMutation,
    ChangeCompanyLogoMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    ChangeCompanyLogoMutation,
    ChangeCompanyLogoMutationVariables
  >(ChangeCompanyLogoDocument, options)
}
export type ChangeCompanyLogoMutationHookResult = ReturnType<
  typeof useChangeCompanyLogoMutation
>
export type ChangeCompanyLogoMutationResult =
  Apollo.MutationResult<ChangeCompanyLogoMutation>
export type ChangeCompanyLogoMutationOptions = Apollo.BaseMutationOptions<
  ChangeCompanyLogoMutation,
  ChangeCompanyLogoMutationVariables
>
export const CompanyDetailsDocument = gql`
  query companyDetails {
    companyDetails {
      id
      name
      registrationNumber
      distributorType
      identificationNumber
      createdAt
      lastmodifiedAt
      isProfileCompleted
      logo {
        url
      }
      contactInfo {
        postalCode
        streetNumber
        additionalAddressInfo
        city
        phoneNumber
        country
        street
      }
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
  query packagingReports(
    $pagination: PaginationInput!
    $filter: PackagingReportsFilterInput!
    $sorting: PackagingReportsSortingOption!
  ) {
    packagingReports(
      pagination: $pagination
      filter: $filter
      sorting: $sorting
    ) {
      items {
        id
        createdAt
        startMonth
        year
        timezoneInfo
        timeframe
        packagingGroupsCount
        isForecastEditable
        isFinalReportSubmitted
        endDatetime
        fees
        invoiceFile {
          url
        }
      }
      pageInfo {
        perPage
        currentPage
        numPages
        totalCount
        hasNextPage
      }
    }
  }
`
export function usePackagingReportsQuery(
  baseOptions: Apollo.QueryHookOptions<
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
export const PackagingReportForecastSubmitDocument = gql`
  mutation packagingReportForecastSubmit(
    $year: Int!
    $startMonth: Int!
    $tzInfo: String!
    $timeframe: TimeframeType!
    $packagingRecords: [PackagingGroupInput!]!
  ) {
    packagingReportForecastSubmit(
      year: $year
      startMonth: $startMonth
      tzInfo: $tzInfo
      timeframe: $timeframe
      packagingRecords: $packagingRecords
    )
  }
`
export type PackagingReportForecastSubmitMutationFn = Apollo.MutationFunction<
  PackagingReportForecastSubmitMutation,
  PackagingReportForecastSubmitMutationVariables
>
export function usePackagingReportForecastSubmitMutation(
  baseOptions?: Apollo.MutationHookOptions<
    PackagingReportForecastSubmitMutation,
    PackagingReportForecastSubmitMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    PackagingReportForecastSubmitMutation,
    PackagingReportForecastSubmitMutationVariables
  >(PackagingReportForecastSubmitDocument, options)
}
export type PackagingReportForecastSubmitMutationHookResult = ReturnType<
  typeof usePackagingReportForecastSubmitMutation
>
export type PackagingReportForecastSubmitMutationResult =
  Apollo.MutationResult<PackagingReportForecastSubmitMutation>
export type PackagingReportForecastSubmitMutationOptions =
  Apollo.BaseMutationOptions<
    PackagingReportForecastSubmitMutation,
    PackagingReportForecastSubmitMutationVariables
  >
export const PackagingReportForecastUpdateDocument = gql`
  mutation packagingReportForecastUpdate(
    $packagingReportId: ID!
    $packagingRecords: [PackagingGroupInput!]!
  ) {
    packagingReportForecastUpdate(
      packagingReportId: $packagingReportId
      packagingRecords: $packagingRecords
    )
  }
`
export type PackagingReportForecastUpdateMutationFn = Apollo.MutationFunction<
  PackagingReportForecastUpdateMutation,
  PackagingReportForecastUpdateMutationVariables
>
export function usePackagingReportForecastUpdateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    PackagingReportForecastUpdateMutation,
    PackagingReportForecastUpdateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    PackagingReportForecastUpdateMutation,
    PackagingReportForecastUpdateMutationVariables
  >(PackagingReportForecastUpdateDocument, options)
}
export type PackagingReportForecastUpdateMutationHookResult = ReturnType<
  typeof usePackagingReportForecastUpdateMutation
>
export type PackagingReportForecastUpdateMutationResult =
  Apollo.MutationResult<PackagingReportForecastUpdateMutation>
export type PackagingReportForecastUpdateMutationOptions =
  Apollo.BaseMutationOptions<
    PackagingReportForecastUpdateMutation,
    PackagingReportForecastUpdateMutationVariables
  >
export const PackagingReportFinalDataSubmitDocument = gql`
  mutation packagingReportFinalDataSubmit(
    $packagingReportId: ID!
    $packagingRecords: [PackagingGroupInput!]!
  ) {
    packagingReportFinalDataSubmit(
      packagingReportId: $packagingReportId
      packagingRecords: $packagingRecords
    )
  }
`
export type PackagingReportFinalDataSubmitMutationFn = Apollo.MutationFunction<
  PackagingReportFinalDataSubmitMutation,
  PackagingReportFinalDataSubmitMutationVariables
>
export function usePackagingReportFinalDataSubmitMutation(
  baseOptions?: Apollo.MutationHookOptions<
    PackagingReportFinalDataSubmitMutation,
    PackagingReportFinalDataSubmitMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    PackagingReportFinalDataSubmitMutation,
    PackagingReportFinalDataSubmitMutationVariables
  >(PackagingReportFinalDataSubmitDocument, options)
}
export type PackagingReportFinalDataSubmitMutationHookResult = ReturnType<
  typeof usePackagingReportFinalDataSubmitMutation
>
export type PackagingReportFinalDataSubmitMutationResult =
  Apollo.MutationResult<PackagingReportFinalDataSubmitMutation>
export type PackagingReportFinalDataSubmitMutationOptions =
  Apollo.BaseMutationOptions<
    PackagingReportFinalDataSubmitMutation,
    PackagingReportFinalDataSubmitMutationVariables
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
export const PackagingReportForecastDetailsDocument = gql`
  query packagingReportForecastDetails($packagingReportId: ID!) {
    packagingReport: packagingReportForecastDetails(
      packagingReportId: $packagingReportId
    ) {
      id
      timeframe
      year
      startMonth
      timezoneInfo
      isForecastEditable
      isFinalReportSubmitted
      forecast {
        id
        materialRecords {
          id
          quantity
          packagingGroup {
            id
            name
          }
          material {
            id
            name
          }
        }
      }
    }
  }
`
export function usePackagingReportForecastDetailsQuery(
  baseOptions: Apollo.QueryHookOptions<
    PackagingReportForecastDetailsQuery,
    PackagingReportForecastDetailsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<
    PackagingReportForecastDetailsQuery,
    PackagingReportForecastDetailsQueryVariables
  >(PackagingReportForecastDetailsDocument, options)
}
export function usePackagingReportForecastDetailsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    PackagingReportForecastDetailsQuery,
    PackagingReportForecastDetailsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    PackagingReportForecastDetailsQuery,
    PackagingReportForecastDetailsQueryVariables
  >(PackagingReportForecastDetailsDocument, options)
}
export type PackagingReportForecastDetailsQueryHookResult = ReturnType<
  typeof usePackagingReportForecastDetailsQuery
>
export type PackagingReportForecastDetailsLazyQueryHookResult = ReturnType<
  typeof usePackagingReportForecastDetailsLazyQuery
>
export type PackagingReportForecastDetailsQueryResult = Apollo.QueryResult<
  PackagingReportForecastDetailsQuery,
  PackagingReportForecastDetailsQueryVariables
>
export const PackagingReportFinalDetailsDocument = gql`
  query packagingReportFinalDetails($packagingReportId: ID!) {
    packagingReport: packagingReportFinalDetails(
      packagingReportId: $packagingReportId
    ) {
      id
      timeframe
      year
      startMonth
      timezoneInfo
      isForecastEditable
      isFinalReportSubmitted
      finalReport {
        id
        fees
        materialRecords {
          id
          quantity
          packagingGroup {
            id
            name
          }
          material {
            id
            name
          }
        }
      }
    }
  }
`
export function usePackagingReportFinalDetailsQuery(
  baseOptions: Apollo.QueryHookOptions<
    PackagingReportFinalDetailsQuery,
    PackagingReportFinalDetailsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<
    PackagingReportFinalDetailsQuery,
    PackagingReportFinalDetailsQueryVariables
  >(PackagingReportFinalDetailsDocument, options)
}
export function usePackagingReportFinalDetailsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    PackagingReportFinalDetailsQuery,
    PackagingReportFinalDetailsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    PackagingReportFinalDetailsQuery,
    PackagingReportFinalDetailsQueryVariables
  >(PackagingReportFinalDetailsDocument, options)
}
export type PackagingReportFinalDetailsQueryHookResult = ReturnType<
  typeof usePackagingReportFinalDetailsQuery
>
export type PackagingReportFinalDetailsLazyQueryHookResult = ReturnType<
  typeof usePackagingReportFinalDetailsLazyQuery
>
export type PackagingReportFinalDetailsQueryResult = Apollo.QueryResult<
  PackagingReportFinalDetailsQuery,
  PackagingReportFinalDetailsQueryVariables
>
