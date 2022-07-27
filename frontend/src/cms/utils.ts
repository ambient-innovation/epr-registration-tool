import { PAGE_TYPES, WagtailPageType } from '@/cms/types'
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

export const getPageUrl = (pageType: WagtailPageType, slug: string): string => {
  if (pageType === 'cms.HomePage') {
    return ROUTES.home
  } else if (pageType === 'cms.StandardPage') {
    return ROUTES.cmsPage(slug)
  } else {
    return '#'
  }
}

/**
 * Takes either an image url or a reference to a wagtail page (slug + type).
 *
 * Returns the given URL or the page URL + a flag whether the returned URL is external or internal.
 * */
export const getInternalOrExternalUrl = (
  url: null | undefined | string,
  page:
    | null
    | undefined
    | {
        slug: string
        type: string
      }
): { isExternal: boolean; url: null | string } => {
  let isExternal = true
  let _url = null

  if (url) {
    _url = url
    if (_url && _url.startsWith('/')) {
      isExternal = false
    }
  } else if (page) {
    const _pageType = getPageType(page.type)
    if (_pageType) {
      _url = getPageUrl(_pageType, page.slug)
      isExternal = false
    }
  }

  return {
    isExternal,
    url: _url,
  }
}
