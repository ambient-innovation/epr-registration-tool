import { LocaleType } from '@/config/i18n'

export const PAGE_TYPES = ['cms.StandardPage', 'cms.HomePage'] as const
export type WagtailPageType = typeof PAGE_TYPES[number]

interface WagtailMeta<T extends WagtailPageType> {
  type: T
  detail_url: string
  slug: string
  show_in_menus: boolean
  seo_title: string
  search_description: string
  first_published_at: string
  alias_of: null | number
  parent: null | number
  locale: LocaleType
}

export interface WagtailBasePage<T extends WagtailPageType = WagtailPageType> {
  id: number
  meta: WagtailMeta<T>
  title: string
}

export interface ParagraphStreamBlock {
  type: 'paragraph'
  value: string
  id: string
}

export interface VideoStreamBlock {
  type: 'image'
  alt_text: string
  image: { url: string; width: number; height: number }
  id: string
}

export type StreamBlock = ParagraphStreamBlock | VideoStreamBlock

export interface WagtailStandardPage
  extends WagtailBasePage<'cms.StandardPage'> {
  body: StreamBlock[]
}

export interface WagtailHomePage extends WagtailBasePage<'cms.HomePage'> {
  body: StreamBlock[]
}

export type WagtailPage = WagtailHomePage | WagtailStandardPage

export interface PagesApiResult {
  meta: {
    total_count: number
  }
  items: WagtailBasePage[]
}

export interface CmsPageBaseProps {
  previewMode: boolean
  menuPages: WagtailBasePage[]
}

export interface CmsPreviewData {
  token: string
  contentType: string
}
