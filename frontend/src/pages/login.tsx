import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'

import { LoginSection } from '@/auth/components/Login'
import { PageLayout } from '@/common/components/PageLayout/PageLayout'

const LoginPage: NextPage = () => {
  const { t } = useTranslation()
  return (
    <>
      <Head>
        <title>{t('loginForm.title')}</title>
        <meta name={'description'} content={t('loginForm.title')} />
        <link rel={'canonical'} href={'/'} />
      </Head>
      <PageLayout>
        <LoginSection />
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

export default LoginPage
