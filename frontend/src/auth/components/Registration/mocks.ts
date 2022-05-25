import { TFunction } from 'next-i18next'

import {
  CompanySectorsDocument,
  CompanySectorsQuery,
  CompanySectorsQueryVariables,
  SectorType,
} from '@/api/__types__'
import { ApolloMock } from '@/utils/typescript.utils'

export const companyCountryOptions = [
  {
    value: 'country1',
    label: 'Country1',
  },
  {
    value: 'country2',
    label: 'Country2',
  },
  {
    value: 'country3',
    label: 'Country3',
  },
  {
    value: 'country4',
    label: 'Country4',
  },
]

export const companyProvinceOptions = [
  {
    value: 'province1',
    label: 'Province1',
  },
  {
    value: 'province2',
    label: 'Province2',
  },
  {
    value: 'province3',
    label: 'Province3',
  },
  {
    value: 'province4',
    label: 'Province4',
  },
]

export const titleOptions = (t: TFunction) => [
  { value: 'mr', label: t('registrationForm.mr') },
  { value: 'mrs', label: t('registrationForm.mrs') },
]

const companySector1: SectorType = {
  id: '1',
  name: 'Food',
  subsectors: [
    { id: '1', name: 'Beverage' },
    { id: '2', name: 'Fruits and vegetables' },
    { id: '3', name: 'Frozen stuff' },
  ],
}
const companySector2: SectorType = {
  id: '2',
  name: 'Non Food',
  subsectors: [
    { id: '4', name: 'Shoes' },
    { id: '5', name: 'Hats' },
    { id: '6', name: 'Shirts' },
  ],
}
const companySector3: SectorType = {
  id: '3',
  name: 'Other',
  subsectors: [
    { id: '7', name: 'Cars' },
    { id: '8', name: 'Airplanes' },
  ],
}

export const companySectorsMock: ApolloMock<
  CompanySectorsQuery,
  CompanySectorsQueryVariables
> = {
  request: {
    query: CompanySectorsDocument,
    variables: {},
  },
  result: {
    data: {
      sectors: [companySector1, companySector2, companySector3],
    },
  },
}
