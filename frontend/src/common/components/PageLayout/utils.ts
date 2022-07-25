import { WagtailBasePage } from '@/cms/types'
import { ROUTES } from '@/routes'

import { MenuPage } from './types'

export const mapToMenuPages = (pages: WagtailBasePage[]): MenuPage[] => {
  return pages.map((page) => {
    return { title: page.title, href: ROUTES.cmsPage(page.meta.slug) }
  })
}
