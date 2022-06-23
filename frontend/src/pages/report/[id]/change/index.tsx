import type { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { DefaultPageHead } from '@/common/components/DefaultPageHead'
import { PageLayout } from '@/common/components/PageLayout/PageLayout'
import { ProtectedPage } from '@/common/components/PageProtection'
import { ReportChangeSection } from '@/packagingReport/components/Forecast'
import { ROUTES } from '@/routes'

interface ForecastChangePage {
  id: string
}
const SubmitFinalReportPage = ({ id }: ForecastChangePage) => {
  // const { t } = useTranslation()
  return (
    <>
      <DefaultPageHead
        subPageTitle={'Change Packaging Report data'}
        relativePath={ROUTES.packagingReportChange(id as string)}
      />
      <PageLayout>
        <ProtectedPage>
          <ReportChangeSection />
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

export default SubmitFinalReportPage
