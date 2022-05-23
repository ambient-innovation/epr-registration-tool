import type { GetStaticProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'

import { RegistrationSection } from '@/auth/components/Registration'
import { PageLayout } from '@/common/components/PageLayout/PageLayout'

const RegistrationPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>{'Register new company | EPR Registration Tool'}</title>
        <meta
          name={'description'}
          content={'Register new company | EPR Registration Tool'}
        />
        <link rel={'canonical'} href={'/'} />
      </Head>
      <PageLayout>
        <RegistrationSection />
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

export default RegistrationPage
