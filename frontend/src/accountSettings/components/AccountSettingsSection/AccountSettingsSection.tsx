import { Box, Tab, Tabs, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/system'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'

import { ROUTES } from '@/routes'

import {
  containerCss,
  formColumnSx,
  tabsColumnSx,
} from './AccountSettingsSection.styles'
import { ChangeLanguageForm } from './ChangeLanguageForm'
import { ChangePasswordForm } from './ChangePasswordForm'

interface AccountSettingsSectionProps {
  activeSection: TabOptions
}

interface LinkTabProps {
  label: string
  href: string
}

export enum TabOptions {
  changePassword = 0,
  changeLanguage = 1,
}

export const AccountSettingsSection = ({
  activeSection,
}: AccountSettingsSectionProps): React.ReactElement => {
  const { t } = useTranslation()
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
    <Box sx={containerCss}>
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
        <LinkTab
          label={t('accountSettings.changeLanguageForm.tabTitle')}
          href={ROUTES.accountSettingsChangeLanguage}
        />
      </Tabs>
      <Box sx={formColumnSx}>
        {activeSection === TabOptions.changePassword ? (
          <ChangePasswordForm />
        ) : activeSection === TabOptions.changeLanguage ? (
          <ChangeLanguageForm />
        ) : null}
      </Box>
    </Box>
  )
}
