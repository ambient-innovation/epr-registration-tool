import { Box, Typography } from '@mui/material'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ParsedUrlQuery } from 'querystring'

import {
  fetchStandardPage,
  fetchAvailablePages,
  fetchPagePreview,
} from '@/cms/api'
import { PreviewAlert } from '@/cms/components/PreviewAlert'
import { StreamFieldSection } from '@/cms/components/StreamFieldSection'
import {
  CmsPageBaseProps,
  CmsPreviewData,
  WagtailStandardPage,
} from '@/cms/types'
import { getPageType } from '@/cms/utils'
import { DefaultPageHead } from '@/common/components/DefaultPageHead'
import { LoadingState } from '@/common/components/LoadingState'
import { PageLayout } from '@/common/components/PageLayout'
import { defaultContainerSx } from '@/theme/layout'
import { H1_DEFAULT_SPACING, TOP_GAP_DEFAULT } from '@/theme/utils'

export interface CmsStandardPageStaticPropsParams extends ParsedUrlQuery {
  slug: string
}

interface NextCmsStandardPageProps extends CmsPageBaseProps {
  page: null | WagtailStandardPage
}

const CmsStandardPage: NextPage<NextCmsStandardPageProps> = ({
  page,
  previewMode,
}) => {
  if (!page) {
    return (
      <>
        <PageLayout>
          <LoadingState />
        </PageLayout>
      </>
    )
  }

  return (
    <>
      <DefaultPageHead
        subPageTitle={page.title}
        description={page.meta.search_description}
        relativePath={`/${page.meta.slug}`}
      />
      <PageLayout>
        {previewMode && <PreviewAlert />}
        <Box
          sx={defaultContainerSx}
          mt={TOP_GAP_DEFAULT}
          mb={H1_DEFAULT_SPACING}
        >
          <Typography component={'h1'} variant={'h1'}>
            {page?.title}
          </Typography>
        </Box>

        <StreamFieldSection blocks={page.body} />
      </PageLayout>
    </>
  )
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
