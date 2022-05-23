import { TFunction } from 'next-i18next'

export const companySectorOptions = [
  {
    value: 'sector1',
    label: 'Sector1',
  },
  {
    value: 'sector2',
    label: 'Sector2',
  },
  {
    value: 'sector3',
    label: 'Sector3',
  },
  {
    value: 'sector4',
    label: 'Sector4',
  },
]

export const companySubSectorsOptions = [
  {
    value: 'subsector1',
    label: 'SubSector1',
  },
  {
    value: 'subsector2',
    label: 'SubSector2',
  },
  {
    value: 'subsector3',
    label: 'SubSector3',
  },
  {
    value: 'subsector4',
    label: 'SubSector4',
  },
]

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
