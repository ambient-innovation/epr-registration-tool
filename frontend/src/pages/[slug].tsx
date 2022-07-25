import type { GetStaticPaths, GetStaticProps } from 'next'
import { NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ParsedUrlQuery } from 'querystring'

import {
  fetchStandardPage,
  fetchAvailablePages,
  fetchPagePreview,
  fetchMenuPages,
} from '@/cms/api'
import { DefaultCmsPage } from '@/cms/components/DefaultCmsPage'
import {
  CmsPageBaseProps,
  CmsPreviewData,
  WagtailStandardPage,
} from '@/cms/types'
import { getPageType } from '@/cms/utils'

export interface CmsStandardPageStaticPropsParams extends ParsedUrlQuery {
  slug: string
}

interface NextCmsStandardPageProps extends CmsPageBaseProps {
  page: null | WagtailStandardPage
}

const CmsStandardPage: NextPage<NextCmsStandardPageProps> = (props) => {
  return <DefaultCmsPage {...props} />
}

export const getStaticProps: GetStaticProps<
  NextCmsStandardPageProps,
  CmsStandardPageStaticPropsParams,
  CmsPreviewData
> = async ({ params, locale, preview, previewData }) => {
  if (!params || !locale) {
    throw new Error('Missing page params or missing locale')
  }

  const previewToken = previewData?.token
  const previewContentType = previewData && getPageType(previewData.contentType)

  const fetchPage = async (): Promise<WagtailStandardPage | null> => {
    if (preview) {
      if (previewToken && previewContentType === 'cms.StandardPage') {
        return fetchPagePreview<WagtailStandardPage>(
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
      return fetchStandardPage(params.slug, locale)
    }
  }

  const page = await fetchPage()

  return {
    props: {
      page: page,
      previewMode: !!preview,
      menuPages: await fetchMenuPages(),
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
    notFound: !page,
  }
}

export const getStaticPaths: GetStaticPaths<
  CmsStandardPageStaticPropsParams
> = async () => {
  const pages = await fetchAvailablePages()

  return {
    paths: pages.map((page) => ({
      params: { slug: page.meta.slug },
    })),
    fallback: 'blocking',
  }
}
export default CmsStandardPage
