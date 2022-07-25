import { PAGE_TYPES, WagtailBasePage, WagtailPageType } from '@/cms/types'
import { ROUTES } from '@/routes'

const LOWERCASE_PAGE_TYPES = PAGE_TYPES.map((item) => item.toLocaleLowerCase())

/**
 * Checks if given string is valid page type (case insensitively)
 * and returns typed string.
 * */
export const getPageType = (pageType: string): null | WagtailPageType => {
  const index = LOWERCASE_PAGE_TYPES.indexOf(pageType.toLowerCase())
  return index >= 0 ? PAGE_TYPES[index] : null
}

export const getPageUrl = (page: WagtailBasePage): string => {
  if (page.meta.type === 'cms.HomePage') {
    return ROUTES.home
  } else if (page.meta.type === 'cms.StandardPage') {
    return ROUTES.cmsPage(page.meta.slug)
  } else {
    return '#'
  }
}
