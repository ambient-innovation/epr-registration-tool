import { Box, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'

import { useExampleQuery } from '@/api/__types__'
import { PageLayout } from '@/common/components/PageLayout'
import { defaultContainerSx } from '@/theme/layout'

export type Homepage = Record<string, never>

export const Homepage = (_: Homepage): React.ReactElement => {
  const { data, loading } = useExampleQuery()
  const { t } = useTranslation()

  return (
    <PageLayout>
      <Box sx={defaultContainerSx}>
        <Box
          sx={{
            my: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 15,
            boxShadow: 3,
            borderRadius: 3,
          }}
        >
          <Typography
            variant={'h1'}
            sx={{ color: 'primary.main' }}
            gutterBottom
          >
            {t('welcome')}
          </Typography>
          <Typography variant={'h2'}>
            {loading ? 'loading...' : data?.helloWorld}
          </Typography>
          <Typography
            variant={'h5'}
            component={'h2'}
            gutterBottom
            sx={{ color: 'secondary.main' }}
          >
            {'Work in progress'}
          </Typography>
        </Box>
      </Box>
    </PageLayout>
  )
}
