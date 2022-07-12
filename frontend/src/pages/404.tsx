import { GetStaticProps, NextPage } from 'next'
import Error from 'next/error'

import { PreviewAlert } from '@/cms/components/PreviewAlert'
import { PageLayout } from '@/common/components/PageLayout'

interface Error404PageProps {
  previewMode: boolean
}

const Error404Page: NextPage<Error404PageProps> = ({ previewMode }) => {
  return (
    <PageLayout>
      {previewMode && <PreviewAlert />}
      <Error statusCode={404} />
    </PageLayout>
  )
}

export const getStaticProps: GetStaticProps<Error404PageProps> = async ({
  preview,
}) => {
  return {
    props: {
      previewMode: !!preview,
    },
  }
}

export default Error404Page
