import { Box, Typography } from '@mui/material'
import type { NextPage } from 'next'
import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'

import { FormLayout } from '@/common/components/FormLayout'
import { PageLayout } from '@/common/components/PageLayout'

const RegistrationPage: NextPage = () => {
  const { t } = useTranslation()
  return (
    <>
      <Head>
        <title>{'Welcome | EPR Registration Tool'}</title>
        <meta
          name={'description'}
          content={'Welcome | EPR Registration Tool'}
        />
        <link rel={'canonical'} href={'/'} />
      </Head>
      <PageLayout>
        <FormLayout>
          <Typography component={'h1'} variant={'h2'}>
            {t('registrationForm.success.title')}
          </Typography>
          <Box p={8} mt={11} bgcolor={'background.light'} borderRadius={3}>
            <Typography component={'h2'} variant={'h2'}>
              {t('registrationForm.success.heading')}
            </Typography>
            <Typography mt={8}>{t('registrationForm.success.desc')}</Typography>
          </Box>
        </FormLayout>
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

export default RegistrationPage
