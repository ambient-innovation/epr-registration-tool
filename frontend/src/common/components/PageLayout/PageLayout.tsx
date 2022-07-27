import { Box } from '@mui/material'

import { MenuPage } from '@/common/components/PageLayout/types'

import { PageFooter } from './PageFooter'
import { PageHeader } from './PageHeader'
import { mainSx, pageLayoutSx } from './PageLayout.styles'

export interface PageLayout {
  children: React.ReactNode
  menuPages?: MenuPage[]
}

export const PageLayout = ({
  children,
  menuPages,
}: PageLayout): React.ReactElement => {
  return (
    <Box sx={pageLayoutSx}>
      <PageHeader pages={menuPages} />
      <Box component={'main'} sx={mainSx}>
        {children}
      </Box>
      <PageFooter />
    </Box>
  )
}
