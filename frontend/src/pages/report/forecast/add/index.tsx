import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { DefaultPageHead } from '@/common/components/DefaultPageHead'
import { PageLayout } from '@/common/components/PageLayout/PageLayout'
import { ProtectedPage } from '@/common/components/PageProtection'
import { ForecastSection } from '@/packagingReport/components/Forecast'
import { ROUTES } from '@/routes'

const ForecastPage: NextPage = () => {
  const { t } = useTranslation()

  return (
    <>
      <DefaultPageHead
        subPageTitle={t('reportForm.createSubPageTitle')}
        relativePath={ROUTES.forecast}
      />
      <PageLayout>
        <ProtectedPage>
          <ForecastSection />
        </ProtectedPage>
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

export default ForecastPage
