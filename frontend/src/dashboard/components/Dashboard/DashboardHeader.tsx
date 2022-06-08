import { Box, Divider, Typography, Stack } from '@mui/material'
import { useTranslation } from 'next-i18next'

export type DashboardHeader = {
  userName: string
}

export const DashboardHeader = ({
  userName,
}: DashboardHeader): React.ReactElement => {
  const { t } = useTranslation()

  return (
    <Box sx={{ marginTop: 11 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent={'space-between'}
      >
        <Box>
          <Typography variant={'h4'}>{t('dashboard.main')}</Typography>
          <Typography variant={'overline'}>
            {t('dashboard.header.greeting', { userName: userName })}
          </Typography>
        </Box>
        <Box sx={{ mt: { xs: 6, sm: 0 } }}></Box>
      </Stack>
      <Divider sx={{ mt: 6 }} />
    </Box>
  )
}
