import { PackagingGroupInput, TimeframeType } from '@/api/__types__'

export interface ForecastData {
  startDate: Date
  timeframe: TimeframeType
  packagingRecords: Array<PackagingGroupInput>
}

export type ForecastDataKey = keyof ForecastData
