import { Box, Typography } from '@mui/material'
import type { GetStaticProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { ParsedUrlQuery } from 'querystring'

import { fetchPagePreview, fetchHomePage } from '@/cms/api'
import { PreviewAlert } from '@/cms/components/PreviewAlert'
import { StreamFieldSection } from '@/cms/components/StreamFieldSection'
import { CmsPageBaseProps, CmsPreviewData, WagtailHomePage } from '@/cms/types'
import { getPageType } from '@/cms/utils'
import { PageLayout } from '@/common/components/PageLayout'
import { defaultContainerSx } from '@/theme/layout'
import { H1_DEFAULT_SPACING, TOP_GAP_DEFAULT } from '@/theme/utils'

export interface HomePageProps extends CmsPageBaseProps {
  page?: WagtailHomePage
}

const Home: NextPage<HomePageProps> = ({ page, previewMode }) => {
  return (
    <>
      <Head>
        <title>{'EPR Registration Tool Home page'}</title>
        <meta
          name={'description'}
          content={'EPR Registration Tool Home page'}
        />
        <link rel={'canonical'} href={'/'} />
      </Head>
      <PageLayout>
        {previewMode && <PreviewAlert sx={{ mb: 5 }} />}
        <Box
          sx={defaultContainerSx}
          mt={TOP_GAP_DEFAULT}
          mb={H1_DEFAULT_SPACING}
        >
          <Typography component={'h1'} variant={'h1'}>
            {page?.title}
          </Typography>
        </Box>
        {page && <StreamFieldSection blocks={page.body} />}
      </PageLayout>
    </>
  )
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
      page: page || undefined,
      previewMode: !!preview,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
    notFound: !page,
  }
}

export default Home
