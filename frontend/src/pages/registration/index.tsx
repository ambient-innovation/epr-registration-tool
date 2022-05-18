import type { NextPage } from 'next'
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

export default RegistrationPage
