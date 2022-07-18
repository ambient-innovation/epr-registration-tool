import { TFunction } from 'next-i18next'

import { PackagingReportsSortingOption as SortingOption } from '@/api/__types__'

export const LIST_SPACING = 6

export const SORTING_OPTIONS_TRANS_MAP: Record<SortingOption, string> = {
  [SortingOption.NEWEST_FIRST]:
    'common:dashboard.reportListSection.sortingOptions.newestFirst',
  [SortingOption.OLDEST_FIRST]:
    'common:dashboard.reportListSection.sortingOptions.oldestFirst',
}

export const getSortingOptions = (
  t: TFunction
): { value: SortingOption; label: string }[] =>
  Object.entries(SORTING_OPTIONS_TRANS_MAP).map(([key, transKey]) => ({
    value: key as SortingOption,
    label: t(transKey),
  }))
