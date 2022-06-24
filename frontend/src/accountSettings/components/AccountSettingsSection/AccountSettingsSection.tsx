import { Box, Tab, Tabs, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/system'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useId } from 'react'

import { ROUTES } from '@/routes'

import {
  containerCssTest,
  formColumnSx,
  tabsColumnSx,
} from './AccountSettingsSection.styles'
import { ChangePasswordForm } from './ChangePasswordForm'

interface AccountSettingsSectionProps {
  activeSection: TabOptions
}

interface LinkTabProps {
  label: string
  href: string
}

enum TabOptions {
  changePassword = 0,
}

export const AccountSettingsSection = ({
  activeSection,
}: AccountSettingsSectionProps): React.ReactElement => {
  const { t } = useTranslation()
  const titleId = useId()
  const firstDescriptionId = useId()
  const secondDescriptionId = useId()
  const descriptionId = firstDescriptionId.concat(' ', secondDescriptionId)
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  const LinkTab = (props: LinkTabProps) => {
    return (
      <Link href={props.href}>
        <Tab component={'a'} {...props} />
      </Link>
    )
  }

  return (
    <Box
      component={'section'}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      sx={containerCssTest}
    >
      <Tabs
        sx={tabsColumnSx}
        orientation={isDesktop ? 'vertical' : 'horizontal'}
        value={activeSection}
        allowScrollButtonsMobile={!isDesktop}
        scrollButtons={!isDesktop}
        centered={!isDesktop}
      >
        <LinkTab
          label={t('accountSettings.changePasswordForm.title')}
          href={ROUTES.accountSettingsChangePassword}
        />
      </Tabs>
      <Box sx={formColumnSx}>
        {activeSection === TabOptions.changePassword && (
          <ChangePasswordForm
            titleId={titleId}
            firstDescriptionId={firstDescriptionId}
            secondDescriptionId={secondDescriptionId}
          />
        )}
      </Box>
    </Box>
  )
}
