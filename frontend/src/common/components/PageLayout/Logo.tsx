import { Typography } from '@mui/material'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

import { ROUTES } from '@/routes'
import { SxStyleObject } from '@/theme/utils'

export interface Logo {
  sx?: SxStyleObject
}

const logoSx: SxStyleObject = {
  color: 'background.paper',
  textDecoration: 'none',
}

export const Logo = ({ sx }: Logo): React.ReactElement => {
  const { locale } = useRouter()
  return (
    <NextLink href={ROUTES.home} locale={locale} passHref>
      <Typography component={'a'} variant={'h2'} sx={[logoSx, !!sx && sx]}>
        {'Logo'}
      </Typography>
    </NextLink>
  )
}
