import { DistributorType } from '@/api/__types__'

export const DISTRIBUTOR_TYPE_MAP: Record<DistributorType, string> = {
  [DistributorType.IMPORTER]:
    'accountSettings.changeCompanyDataForm.companyDistributorType.importer',
  [DistributorType.LOCAL_PRODUCER]:
    'accountSettings.changeCompanyDataForm.companyDistributorType.localProducer',
}
