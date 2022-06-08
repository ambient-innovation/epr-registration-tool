import { TFunction } from 'i18next'

import { DistributorType } from '@/api/__types__'

export const distributorTypes = (t: TFunction): Record<string, string> => {
  return {
    [DistributorType.IMPORTER]: t(
      'registrationForm.companyDistributorType.importer'
    ),
    [DistributorType.LOCAL_PRODUCER]: t(
      'registrationForm.companyDistributorType.localProducer'
    ),
  }
}
