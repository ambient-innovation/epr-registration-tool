import type { GetStaticProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ParsedUrlQuery } from 'querystring'

import { fetchPagePreview, fetchHomePage, fetchMenuPages } from '@/cms/api'
import { DefaultCmsPage } from '@/cms/components/DefaultCmsPage'
import { CmsPageBaseProps, CmsPreviewData, WagtailHomePage } from '@/cms/types'
import { getPageType } from '@/cms/utils'

export interface HomePageProps extends CmsPageBaseProps {
  page: null | WagtailHomePage
}

const Home: NextPage<HomePageProps> = (props) => {
  return <DefaultCmsPage {...props} />
}

export const getStaticProps: GetStaticProps<
  HomePageProps,
  ParsedUrlQuery,
  CmsPreviewData
> = async ({ locale, preview, previewData }) => {
  if (!locale) {
    throw new Error('Missing locale')
  }

  const previewToken = previewData?.token
  const previewContentType = previewData && getPageType(previewData.contentType)

  const fetchPage = async (): Promise<WagtailHomePage | null> => {
    if (preview) {
      if (previewToken && previewContentType === 'cms.HomePage') {
        return fetchPagePreview<WagtailHomePage>(
          previewContentType,
          previewToken
        )
      } else {
        // case: preview is true, but either
        // - contentType is unexpected
        // - or fetchPagePreview returned null
        return null
      }
    } else {
      return fetchHomePage(locale)
    }
  }

  const page = await fetchPage()

  return {
    props: {
      page: page,
      previewMode: !!preview,
      menuPages: await fetchMenuPages(locale),
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
    // home page should never be not found
    notFound: false,
  }
}

export default Home
