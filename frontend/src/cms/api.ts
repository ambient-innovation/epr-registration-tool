import { CMS_API_URL } from '@/cms/config'
import {
  PagesApiResult,
  WagtailHomePage,
  WagtailBasePage,
  WagtailPageType,
  WagtailStandardPage,
  WagtailPage,
} from '@/cms/types'
import { DEFAULT_LOCALE } from '@/config/i18n'
import { joinUrl } from '@/utils/url.utils'

export interface WagtailApiQueryParams {
  slug?: string
  type?: WagtailPageType
  locale?: string
  translation_of?: number
  show_in_menus?: boolean
}

const fetchTranslatedPageId = async (
  originalPageId: number,
  locale: string
): Promise<number | null> => {
  const translatedPages = await fetchPagesList({
    locale,
    translation_of: originalPageId,
  })
  if (translatedPages.length === 0) {
    return null
  }
  if (translatedPages.length > 1) {
    throw new Error(
      `Page query returned not a single item for translations of page id="${originalPageId}" but ${translatedPages.length} items`
    )
  }
  return translatedPages[0].id
}

export const fetchPagePreview = async <P extends WagtailPage>(
  contentType: WagtailPageType,
  token: string
): Promise<null | P> => {
  const url = joinUrl(
    CMS_API_URL,
    // the page_preview/<id>/ does not matter, the preview page is defined by the token
    `page_preview/1/?content_type=${contentType.toLocaleLowerCase()}&token=${token}`
  )
  const response = await fetch(url)
  if (response.status === 404) {
    return null
  }
  if (!response.ok) {
    throw new Error(
      `Could not fetch page details (${response.url}), server responded with status ${response.statusText}`
    )
  }
  const page = await response.json()
  return page as P
}

export const fetchPageDetails = async (
  locale: string,
  query: WagtailApiQueryParams
): Promise<null | unknown> => {
  const urlSearchParams = new URLSearchParams(query as Record<string, string>)
  // always fetch page in default language first
  const pages = await fetchPagesList({ ...query, locale: DEFAULT_LOCALE })

  if (pages.length === 0) {
    return null
  }
  if (pages.length > 1) {
    throw new Error(
      `Page query returned not a single item for query "${urlSearchParams}" but ${pages.length} items`
    )
  }
  const originalPageId = pages[0].id

  const pageId =
    locale === DEFAULT_LOCALE
      ? originalPageId
      : await fetchTranslatedPageId(originalPageId, locale)

  if (!pageId) {
    return null
  }

  const detailsRes = await fetch(joinUrl(CMS_API_URL, `pages/${pageId}`))
  if (!detailsRes.ok) {
    throw new Error(
      `Could not fetch page details (${detailsRes.url}), server responded with status ${detailsRes.statusText}`
    )
  }
  return await detailsRes.json()
}

export const fetchStandardPage = async (
  slug: string,
  locale: string
): Promise<null | WagtailStandardPage> => {
  const page = await fetchPageDetails(locale, {
    slug,
    type: 'cms.StandardPage',
  })
  return page as WagtailStandardPage
}

export const fetchHomePage = async (
  locale: string
): Promise<null | WagtailHomePage> => {
  const page = await fetchPageDetails(locale, { type: 'cms.HomePage' })
  return page as WagtailHomePage
}

export const fetchPagesList = async (
  query?: WagtailApiQueryParams
): Promise<WagtailBasePage[]> => {
  const baseUrl = joinUrl(CMS_API_URL, `pages`)
  const urlSearchParams = new URLSearchParams(
    query as Record<string, string> | undefined
  )
  const response = await fetch(baseUrl + '?' + urlSearchParams)
  if (response.status === 404) {
    return []
  }
  if (!response.ok) {
    throw new Error(
      `Could not fetch pages. Server responded with` +
        `status "${response.statusText}", body ${response.body}`
    )
  }
  const result: PagesApiResult = await response.json()
  return result.items
}

export const fetchAvailablePages = (): Promise<WagtailBasePage[]> => {
  return fetchPagesList({ locale: DEFAULT_LOCALE })
}

export const fetchMenuPages = (locale: string): Promise<WagtailBasePage[]> => {
  return fetchPagesList({ locale: locale, show_in_menus: true })
}

export const fetchMenuPagesForRevalidate = (): Promise<WagtailBasePage[]> => {
  return fetchPagesList({ show_in_menus: true })
}
