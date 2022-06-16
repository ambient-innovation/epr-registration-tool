import type { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { DefaultPageHead } from '@/common/components/DefaultPageHead'
import { PageLayout } from '@/common/components/PageLayout/PageLayout'
import { ProtectedPage } from '@/common/components/PageProtection'
import { ForecastChangeSection } from '@/packagingReport/components/Forecast'
import { ROUTES } from '@/routes'

interface ForecastChangePage {
  id: string
}
const ForecastChangePage = ({ id }: ForecastChangePage) => {
  const { t } = useTranslation()
  return (
    <>
      <DefaultPageHead
        subPageTitle={t('reportForm.createSubPageTitle')}
        relativePath={ROUTES.forecastChange(id as string)}
      />
      <PageLayout>
        <ProtectedPage>
          <ForecastChangeSection />
        </ProtectedPage>
      </PageLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
  const id = query.id as string
  return {
    props: {
      id,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  }
}

export default ForecastChangePage
