import {
  CompanyContactInfoType,
  CompanyDetailsWithContactInfoDocument,
  CompanyDetailsWithContactInfoQuery,
  CompanyDetailsWithContactInfoQueryVariables,
  CompanyType,
  DistributorType,
} from '@/api/__types__'
import { ApolloMock } from '@/utils/typescript.utils'

const mockContactInfo: CompanyContactInfoType = {
  country: 'Germany',
  city: 'Stuttgart',
  postalCode: '70597',
  street: 'Musterstraße',
  streetNumber: '4',
  additionalAddressInfo: '',
  phoneNumber: '+49 123456789',
}

const mockCompany1: CompanyType = {
  id: '1',
  name: 'My Company',
  registrationNumber: 'EN1312563035',
  distributorType: DistributorType.IMPORTER,
  identificationNumber: '123456789',
  isProfileCompleted: true,
  countryCode: 'en',
  logo: {
    height: 375,
    name: 'ea6cbd1d-12d7-4c90-a636-2f7620417b6e.jpeg',
    size: 117691,
    url: 'https://picsum.photos/375/375',
    width: 375,
  },
  contactInfo: mockContactInfo,
  lastmodifiedAt: '2022-07-21T13:39:42.328952+00:00',
  createdAt: '2022-06-29T08:34:18.773221+00:00',
}

export const companyDetailsWithContactMock: ApolloMock<
  CompanyDetailsWithContactInfoQuery,
  CompanyDetailsWithContactInfoQueryVariables
> = {
  delay: 1000,
  request: {
    query: CompanyDetailsWithContactInfoDocument,
    variables: {},
  },
  result: {
    data: {
      companyDetails: mockCompany1,
    },
  },
}
