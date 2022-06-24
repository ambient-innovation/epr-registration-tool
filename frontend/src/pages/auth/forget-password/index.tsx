import type { NextPage } from 'next'
import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { RequestResetPasswordSection } from '@/auth/components/ResetPassword'
import { DefaultPageHead } from '@/common/components/DefaultPageHead'
import { PageLayout } from '@/common/components/PageLayout'
import { NotLoggedInPage } from '@/common/components/PageProtection'
import { ROUTES } from '@/routes'

const ForgetPasswordPage: NextPage = () => {
  const { t } = useTranslation()
  return (
    <>
      <DefaultPageHead
        subPageTitle={t('resetPassword.forgetPasswordTitle')}
        relativePath={ROUTES.forgetPassword}
      />
      <PageLayout>
        <NotLoggedInPage>
          <RequestResetPasswordSection />
        </NotLoggedInPage>
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

export default ForgetPasswordPage
