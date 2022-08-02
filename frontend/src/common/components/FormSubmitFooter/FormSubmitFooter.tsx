import { Box, Button } from '@mui/material'
import { useTranslation } from 'next-i18next'

import { SxStyleObject } from '@/theme/utils'

export type FormSubmitFooter = {
  isSubmitting: boolean
  buttonLabelKey?: string
  forceLoading?: boolean
  sx?: SxStyleObject
}

export const FormSubmitFooter = ({
  isSubmitting,
  buttonLabelKey = 'submit',
  forceLoading = false,
  sx,
}: FormSubmitFooter) => {
  const { t } = useTranslation()

  const isLoading = isSubmitting || forceLoading

  return (
    <Box
      component={'footer'}
      sx={{ mt: 6, display: 'flex', justifyContent: 'flex-end', ...sx }}
    >
      <Button variant={'contained'} type={'submit'} disabled={isLoading}>
        {isLoading ? t('loading') : t(buttonLabelKey)}
      </Button>
    </Box>
  )
}
