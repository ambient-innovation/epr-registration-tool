import type { GetStaticProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'

import { PageLayout } from '@/common/components/PageLayout'
import { Dashboard } from '@/dashboard/components/Dashboard'

const DashboardPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>{'Dashboard | EPR Registration Tool'}</title>
        <meta
          name={'description'}
          content={'Dashboard | EPR Registration Tool'}
        />
        <link rel={'canonical'} href={'/'} />
      </Head>
      <PageLayout>
        <Dashboard />
      </PageLayout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  }
}

export default DashboardPage
