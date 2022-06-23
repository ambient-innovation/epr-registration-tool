import { Box, Typography, Grid, Button } from '@mui/material'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import NextLink from 'next/link'

import { DefaultPageHead } from '@/common/components/DefaultPageHead'
import { FormLayout } from '@/common/components/FormLayout'
import { PageLayout } from '@/common/components/PageLayout'
import { ROUTES } from '@/routes'

const ReportChangeSuccessPage: NextPage = () => {
  const { t } = useTranslation()

  return (
    <>
      <DefaultPageHead
        subPageTitle={t('reportForm.successSubPageTitle')}
        relativePath={ROUTES.forecastSuccess}
      />
      <PageLayout>
        <FormLayout>
          <Typography component={'h1'} variant={'h2'}>
            {t('reportForm.reportUpdatedSuccessful')}
          </Typography>
          <Box p={8} mt={11} bgcolor={'background.light'} borderRadius={3}>
            <Typography component={'h2'} variant={'h5'}>
              {t('reportForm.createReportSuccessTitle')}
            </Typography>
            <Typography mt={8}>
              {t('reportForm.updateReportSuccessDescription')}
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
              <NextLink href={ROUTES.dashboard} passHref>
                <Button variant={'contained'} color={'primary'} sx={{ ml: 5 }}>
                  {t('reportForm.proceedToDashboard')}
                </Button>
              </NextLink>
            </Grid>
          </Grid>
        </FormLayout>
      </PageLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  }
}

export default ReportChangeSuccessPage
