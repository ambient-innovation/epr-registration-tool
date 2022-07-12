import { PAGE_TYPES, WagtailPageType } from '@/cms/types'

const LOWERCASE_PAGE_TYPES = PAGE_TYPES.map((item) => item.toLocaleLowerCase())

/**
 * Checks if given string is valid page type (case insensitively)
 * and returns typed string.
 * */
export const getPageType = (pageType: string): null | WagtailPageType => {
  const index = LOWERCASE_PAGE_TYPES.indexOf(pageType.toLowerCase())
  return index >= 0 ? PAGE_TYPES[index] : null
}
