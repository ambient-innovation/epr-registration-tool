import { TFunction } from 'i18next'

import { DistributorType } from '@/api/__types__'

export const getTitleOptions = (t: TFunction) => [
  { value: 'mr', label: t('registrationForm.mr') },
  { value: 'mrs', label: t('registrationForm.mrs') },
]

export const getDistributorTypeOptions = (t: TFunction) => [
  {
    value: DistributorType.IMPORTER,
    label: t('registrationForm.companyDistributorType.importer'),
  },
  {
    value: DistributorType.LOCAL_PRODUCER,
    label: t('registrationForm.companyDistributorType.localProducer'),
  },
]
