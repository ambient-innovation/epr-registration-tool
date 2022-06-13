import { Box, Typography, Grid, Button } from '@mui/material'
import type { NextPage } from 'next'
import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import NextLink from 'next/link'

import { DefaultPageHead } from '@/common/components/DefaultPageHead'
import { FormLayout } from '@/common/components/FormLayout'
import { PageLayout } from '@/common/components/PageLayout'
import { ROUTES } from '@/routes'

const ReportSuccssPage: NextPage = () => {
  const { t } = useTranslation()
  return (
    <>
      <Head>
        <DefaultPageHead
          subPageTitle={t('reportForm.successSubPageTitle')}
          relativePath={ROUTES.forecastSuccess}
        />
      </Head>
      <PageLayout>
        <FormLayout>
          <Typography component={'h1'} variant={'h2'}>
            {t('reportForm.reportSuccessful')}
          </Typography>
          <Box p={8} mt={11} bgcolor={'background.light'} borderRadius={3}>
            <Typography component={'h2'} variant={'h5'}>
              {t('reportForm.createReportSuccessTitle')}
            </Typography>
            <Typography mt={8}>
              {t('reportForm.createReportSuccessDescription')}
            </Typography>
          </Box>
          <Grid container mt={8} justifyContent={'end'} alignItems={'center'}>
            <Grid>
              <NextLink href={ROUTES.forecast} passHref>
                <Button variant={'inverted'} color={'primary'} component={'a'}>
                  {t('reportForm.createAnotherReport')}
                </Button>
              </NextLink>
            </Grid>
            <Grid>
              <NextLink href={ROUTES.home} passHref>
                <Button variant={'contained'} color={'primary'} sx={{ ml: 5 }}>
                  {t('reportForm.proceedToHomepage')}
                </Button>
              </NextLink>
            </Grid>
          </Grid>
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

export default ReportSuccssPage
