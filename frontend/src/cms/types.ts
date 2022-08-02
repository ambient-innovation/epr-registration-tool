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

export interface CtaValue {
  label: null | string
  internal_page: null | {
    slug: string
    type: WagtailPageType
  }
  external_link: null | string
}

export type BackgroundOption = 'default' | 'shaded'

export interface BaseTextBlockValue {
  heading: string
  body: string
  cta: null | CtaValue
  orientation: 'left' | 'center'
}

export interface TextBlockValue extends BaseTextBlockValue {
  background: BackgroundOption
}

export interface TextBlockData {
  type: 'text'
  id: string
  value: TextBlockValue
}

export interface CmsImageValue {
  url: string
  width: number
  height: number
  alt_text: string
  caption: null | string
  placeholder: null | string
}

export interface FullWidthImageBlockData {
  type: 'fullWidthImage'
  id: string
  value: {
    image: CmsImageValue
    heading: string
    background: BackgroundOption
  }
}

export interface ImageWithTextBlockData {
  type: 'imageWithText'
  id: string
  value: {
    image: CmsImageValue
    text: Omit<BaseTextBlockValue, 'orientation'>
    background: BackgroundOption
    orientation: 'textFirst' | 'imageFirst' | 'fullWidthImage'
  }
}

export type StreamBlockData =
  | TextBlockData
  | FullWidthImageBlockData
  | ImageWithTextBlockData

export interface WagtailStandardPage
  extends WagtailBasePage<'cms.StandardPage'> {
  body: StreamBlockData[]
}

export interface WagtailHomePage extends WagtailBasePage<'cms.HomePage'> {
  body: StreamBlockData[]
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
