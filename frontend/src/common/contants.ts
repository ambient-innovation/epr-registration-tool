import { TFunction } from 'next-i18next'

import { TimeframeType } from '@/api/__types__'

export const timeframeDisplayValue = (
  t: TFunction
): Record<TimeframeType, string> => ({
  [TimeframeType.MONTH]: t('timeframe.month', { count: 1 }) as string,
  [TimeframeType.THREE_MONTHS]: t('timeframe.month_plural', {
    count: 3,
  }) as string,
  [TimeframeType.TWELVE_MONTHS]: t('timeframe.month_plural', {
    count: 12,
  }) as string,
})

export const timeframeNumberValue = {
  [TimeframeType.MONTH]: 1,
  [TimeframeType.THREE_MONTHS]: 3,
  [TimeframeType.TWELVE_MONTHS]: 12,
}

export const forecastTimeframeOptions = (
  t: TFunction
): Array<{
  value: TimeframeType
  label: string
}> => [
  {
    value: TimeframeType.MONTH,
    label: timeframeDisplayValue(t)[TimeframeType.MONTH],
  },
  {
    value: TimeframeType.THREE_MONTHS,
    label: timeframeDisplayValue(t)[TimeframeType.THREE_MONTHS],
  },
  {
    value: TimeframeType.TWELVE_MONTHS,
    label: timeframeDisplayValue(t)[TimeframeType.TWELVE_MONTHS],
  },
]

export const getLanguageOptions = () => [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'عربي' },
]
