import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Button } from '@mui/material'
import NextLink from 'next/link'

import { SxStyles } from '@/theme/utils'

export const BackButton = ({
  url,
  style,
  label,
}: {
  url: string
  label: string
  style?: SxStyles
}) => {
  return (
    <NextLink href={url} passHref>
      <Button
        component={'a'}
        variant={'text'}
        startIcon={<ArrowBackIcon />}
        sx={style}
      >
        {label}
      </Button>
    </NextLink>
  )
}
