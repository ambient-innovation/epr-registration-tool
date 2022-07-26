import { Typography } from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import ErrorPage from 'next/error'

import { PreviewAlert } from '@/cms/components/PreviewAlert'
import { StreamBlocks } from '@/cms/components/StreamBlocks'
import { CmsPageBaseProps, WagtailPage } from '@/cms/types'
import { getPageUrl } from '@/cms/utils'
import { DefaultPageHead } from '@/common/components/DefaultPageHead'
import { PageLayout } from '@/common/components/PageLayout'
import { mapToMenuPages } from '@/common/components/PageLayout/utils'

export interface DefaultCmsPage extends CmsPageBaseProps {
  page: null | WagtailPage
}

export const DefaultCmsPage = ({
  previewMode,
  page,
  menuPages,
}: DefaultCmsPage): React.ReactElement => {
  if (!page) {
    // This should never happen.
    // If the page does not exist, the server response should be 404 and thus show the _404 page.
    return (
      <PageLayout>
        <ErrorPage
          statusCode={404}
          title={'This page does not seem to exist 🤷‍'}
        />
      </PageLayout>
    )
  }
  return (
    <>
      <DefaultPageHead
        subPageTitle={page.title}
        description={page.meta.search_description}
        relativePath={getPageUrl(page.meta.type, page.meta.slug)}
      />
      <PageLayout menuPages={mapToMenuPages(menuPages)}>
        {previewMode && <PreviewAlert />}
        <Typography component={'h1'} sx={visuallyHidden}>
          {page?.title}
        </Typography>
        {page && <StreamBlocks blocks={page.body} />}
      </PageLayout>
    </>
  )
}
