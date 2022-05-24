import { Box, SxProps, Theme, Typography } from '@mui/material'
import Link from 'next/link'

import { LangSwitcher } from '@/common/components/langSwitcher'
import { ROUTES } from '@/routes'
import { pxToRemAsString } from '@/theme/utils'

import { wrapperCss } from './PageLayout.styles'

export interface PageLayout {
  children: React.ReactNode
}

const headerSx: SxProps<Theme> = {
  backgroundColor: 'primary.main',
  height: pxToRemAsString(88),
  position: 'relative',
  zIndex: 'drawer',
  display: 'flex',
  alignItems: 'center',
}

export const PageLayout = ({ children }: PageLayout): React.ReactElement => {
  return (
    <div>
      <Box component={'header'} sx={headerSx}>
        <div css={wrapperCss}>
          <Link href={ROUTES.home} passHref>
            <Typography
              component={'a'}
              variant={'h5'}
              sx={{
                color: 'background.paper',
                textDecoration: 'none',
              }}
            >
              {'Logo'}
            </Typography>
          </Link>
          <Box>
            <LangSwitcher />
          </Box>
        </div>
      </Box>
      <main>{children}</main>
    </div>
  )
}
