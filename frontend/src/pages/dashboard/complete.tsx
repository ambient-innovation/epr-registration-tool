import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'

import { DefaultPageHead } from '@/common/components/DefaultPageHead'
import { PageLayout } from '@/common/components/PageLayout'
import { CompanyProfileSection } from '@/dashboard/components/CompanyProfileCompletion'
import { ROUTES } from '@/routes'

const Complete: NextPage = () => {
  const { t } = useTranslation()
  return (
    <>
      <Head>
        <DefaultPageHead
          subPageTitle={t('companyCompletionForm.completeAccount')}
          relativePath={ROUTES.dashboardComplete}
        />
      </Head>
      <PageLayout>
        <CompanyProfileSection />
      </PageLayout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common'])),
      // Will be passed to the page component as props
    },
  }
}

export default Complete
