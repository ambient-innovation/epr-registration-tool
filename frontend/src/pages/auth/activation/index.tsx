import type { NextPage } from 'next'
import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { EmailConfirmation } from '@/auth/components/Activation'
import { DefaultPageHead } from '@/common/components/DefaultPageHead'
import { PageLayout } from '@/common/components/PageLayout'
import { ROUTES } from '@/routes'

const ActivationPage: NextPage = () => {
  const { t } = useTranslation()
  return (
    <>
      <DefaultPageHead
        subPageTitle={t('activation.activation')}
        relativePath={ROUTES.accountActivation}
      />
      <PageLayout>
        <EmailConfirmation />
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

export default ActivationPage
