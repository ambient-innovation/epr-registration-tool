import {
  MaterialRecordType,
  PackagingGroupInput,
  PackagingReportFinalDetailsQuery,
  PackagingReportForecastDetailsQuery,
  Scalars,
} from '@/api/__types__'
import { ForecastData } from '@/packagingReport/components/Forecast/types'

export const generateDefaultReportFormData = (
  packagingReport?:
    | PackagingReportForecastDetailsQuery['packagingReport']
    | PackagingReportFinalDetailsQuery['packagingReport'],
  submission?: { id: Scalars['ID']; materialRecords: Array<MaterialRecordType> }
): ForecastData | undefined => {
  if (!packagingReport || !submission) {
    return undefined
  }
  return {
    startDate: new Date(
      packagingReport?.year,
      packagingReport?.startMonth - 1,
      1
    ),
    timeframe: packagingReport.timeframe,
    packagingRecords: !submission.materialRecords.length
      ? []
      : submission.materialRecords.reduce((acc, current) => {
          const {
            quantity,
            packagingGroup: { id: packagingGroupId },
            material: { id: materialId },
          } = current
          const materialObj = { quantity, materialId }
          const groupIndex = acc.findIndex(
            (item) => item.packagingGroupId === packagingGroupId
          )
          if (groupIndex === -1) {
            acc = [
              ...acc,
              { packagingGroupId, materialRecords: [{ ...materialObj }] },
            ]
          } else {
            acc[groupIndex] = {
              packagingGroupId,
              materialRecords: [
                ...acc[groupIndex].materialRecords,
                { ...materialObj },
              ],
            }
          }
          return acc
        }, [] as Array<PackagingGroupInput>),
  }
}
