import { Box, Divider, Typography } from '@mui/material'
import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { AccountSettingsSection } from '@/accountSettings/components/AccountSettingsSection'
import { TabOptions } from '@/accountSettings/components/AccountSettingsSection/AccountSettingsSection'
import { DefaultPageHead } from '@/common/components/DefaultPageHead'
import { PageLayout } from '@/common/components/PageLayout'
import { ProtectedPage } from '@/common/components/PageProtection'
import { ROUTES } from '@/routes'
import { maxWidthCss, paddedSectionCss } from '@/theme/layout'
import { H1_DEFAULT_SPACING } from '@/theme/utils'

const EditAccountPage: NextPage = () => {
  const { t } = useTranslation()

  return (
    <>
      <DefaultPageHead
        subPageTitle={t('accountSettings.editAccountForm.title')}
        relativePath={ROUTES.accountSettingsEditAccount}
      />
      <PageLayout>
        <ProtectedPage>
          <Box sx={[maxWidthCss, paddedSectionCss, { marginTop: 11 }]}>
            <Typography component={'h1'} variant={'h1'} mb={H1_DEFAULT_SPACING}>
              {t('accountSettings.main')}
            </Typography>
            <Divider />
          </Box>
          <AccountSettingsSection activeSection={TabOptions.editAccount} />
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

export default EditAccountPage
