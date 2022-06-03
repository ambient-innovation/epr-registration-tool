import { Box, Divider, Typography } from '@mui/material'
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
      <Typography variant={'h4'}>{t('dashboard.main')}</Typography>
      <Typography variant={'overline'}>
        {t('dashboard.header.greeting', { userName: userName })}
      </Typography>
      <Divider />
    </Box>
  )
}
