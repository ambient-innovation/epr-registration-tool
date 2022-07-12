import { Alert, AlertProps, Button } from '@mui/material'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'

import { SxStyleObject } from '@/theme/utils'

export type PreviewAlert = Omit<AlertProps, 'severity'>

export const PreviewAlert = ({
  sx,
  ...props
}: PreviewAlert): React.ReactElement => {
  const { t } = useTranslation()
  return (
    <Alert
      severity={'info'}
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        ...(sx as SxStyleObject),
      }}
      {...props}
    >
      {t('previewAlert.youAreInPreviewMode')}
      <Link
        href={'/api/stop-preview'}
        passHref
        // https://nextjs.org/docs/advanced-features/preview-mode#clear-the-preview-mode-cookies
        prefetch={false}
      >
        <Button component={'a'} variant={'outlined'} sx={{ ml: 5 }}>
          {t('previewAlert.stopPreview')}
        </Button>
      </Link>
    </Alert>
  )
}
