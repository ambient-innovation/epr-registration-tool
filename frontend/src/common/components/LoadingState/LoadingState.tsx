import { CircularProgress, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'

export const LoadingState = (): React.ReactElement => {
  const { t } = useTranslation()

  return (
    <Stack
      mt={'20vh'}
      justifyContent={'center'}
      alignItems={'center'}
      spacing={3}
    >
      <CircularProgress aria-hidden={'true'} />
      <Typography>{t('pleaseWait')}</Typography>
    </Stack>
  )
}
