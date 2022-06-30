import { Box, Stack, SxProps, Theme, Typography } from '@mui/material'
import Link from 'next/link'

import { LangSwitcher } from '@/common/components/LangSwitcher'
import { UserControls } from '@/common/components/UserControls'
import { ROUTES } from '@/routes'
import { pxToRemAsString } from '@/theme/utils'

import { mainSx, wrapperSx } from './PageLayout.styles'

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
        <Box sx={wrapperSx}>
          <Link href={ROUTES.home} passHref>
            <Typography
              component={'a'}
              variant={'h2'}
              sx={{
                color: 'background.paper',
                textDecoration: 'none',
              }}
            >
              {'Logo'}
            </Typography>
          </Link>
          <Box>
            <Stack spacing={10} direction={'row'}>
              <UserControls />
              <LangSwitcher />
            </Stack>
          </Box>
        </Box>
      </Box>
      <Box component={'main'} sx={mainSx}>
        {children}
      </Box>
    </div>
  )
}
