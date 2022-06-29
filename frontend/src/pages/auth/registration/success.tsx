import { Box, Typography } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'

import { FormLayout } from '@/common/components/FormLayout'
import { PageLayout } from '@/common/components/PageLayout'

const RegistrationPage: NextPage = () => {
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
            {'Registration successful'}
          </Typography>
          <Box p={8} mt={11} bgcolor={'background.light'} borderRadius={3}>
            <Typography component={'h2'} variant={'h2'}>
              {'Thank you for registering'}
            </Typography>
            <Typography mt={8}>
              {'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. ' +
                'Aenean commodo ligula eget dolor. Aenean massa. ' +
                'Cum sociis natoque penatibus et magnis dis parturient montes, ' +
                'nascetur ridiculus mus.'}
            </Typography>
          </Box>
        </FormLayout>
      </PageLayout>
    </>
  )
}

export default RegistrationPage
