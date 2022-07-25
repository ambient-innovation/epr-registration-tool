import { Box } from '@mui/material'

import { MenuPage } from '@/common/components/PageLayout/types'

import { PageHeader } from './PageHeader'
import { mainSx } from './PageLayout.styles'

export interface PageLayout {
  children: React.ReactNode
  menuPages?: MenuPage[]
}

export const PageLayout = ({
  children,
  menuPages,
}: PageLayout): React.ReactElement => {
  return (
    <div>
      <PageHeader pages={menuPages} />
      <Box component={'main'} sx={mainSx}>
        {children}
      </Box>
    </div>
  )
}
