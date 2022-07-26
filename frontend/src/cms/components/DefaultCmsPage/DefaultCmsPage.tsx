import { Box, Typography } from '@mui/material'
import ErrorPage from 'next/error'

import { PreviewAlert } from '@/cms/components/PreviewAlert'
import { StreamFieldSection } from '@/cms/components/StreamFieldSection'
import { CmsPageBaseProps, WagtailPage } from '@/cms/types'
import { getPageUrl } from '@/cms/utils'
import { DefaultPageHead } from '@/common/components/DefaultPageHead'
import { PageLayout } from '@/common/components/PageLayout'
import { mapToMenuPages } from '@/common/components/PageLayout/utils'
import { defaultContainerSx } from '@/theme/layout'
import { H1_DEFAULT_SPACING, TOP_GAP_DEFAULT } from '@/theme/utils'

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
        relativePath={getPageUrl(page)}
      />
      <PageLayout menuPages={mapToMenuPages(menuPages)}>
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
