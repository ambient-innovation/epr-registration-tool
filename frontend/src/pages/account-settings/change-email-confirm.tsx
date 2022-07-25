import { Alert, AlertTitle, Box } from '@mui/material'
import { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'

import { DefaultPageHead } from '@/common/components/DefaultPageHead'
import { ErrorAlert } from '@/common/components/ErrorAlert'
import { LoadingState } from '@/common/components/LoadingState'
import { PageLayout } from '@/common/components/PageLayout'
import { ROUTES } from '@/routes'
import { defaultContainerSx } from '@/theme/layout'
import { H1_DEFAULT_SPACING, TOP_GAP_DEFAULT } from '@/theme/utils'

const ChangeEmailConfirmPage: NextPage = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { state } = router.query
  return (
    <>
      <DefaultPageHead
        subPageTitle={t('changeEmailConfirm.changeEmail')}
        relativePath={ROUTES.changeEmailConfirm}
      />
      <PageLayout>
        <Box
          sx={defaultContainerSx}
          mt={TOP_GAP_DEFAULT}
          mb={H1_DEFAULT_SPACING}
        >
          {!state ? (
            <LoadingState />
          ) : state === 'success' ? (
            <Alert
              sx={{ alignItems: 'center' }}
              variant={'filled'}
              severity={'success'}
            >
              <AlertTitle>{t('changeEmailConfirm.changeEmail')}</AlertTitle>
              {t('changeEmailConfirm.changeEmailSuccess')}
            </Alert>
          ) : (
            <ErrorAlert title={t('changeEmailConfirm.changeEmail')}>
              {t([
                `changeEmailConfirm.changeEmailFailed.${state}`,
                'changeEmailConfirm.changeEmailFailed.unknownError',
              ])}
            </ErrorAlert>
          )}
        </Box>
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

export default ChangeEmailConfirmPage
