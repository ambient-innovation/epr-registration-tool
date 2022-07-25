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
import { ChangeCompanyDetails } from './ChangeCompanyData'
import { ChangeLanguageForm } from './ChangeLanguageForm'
import { ChangePasswordForm } from './ChangePasswordForm'
import { EditAccount } from './EditAccountForm'

export interface AccountSettingsSection {
  activeSection: TabOptions
}

interface LinkTabProps {
  label: string
  href: string
}

export enum TabOptions {
  changePassword = 0,
  changeCompanyData = 1,
  changeLanguage = 2,
  editAccount = 3,
}

export const AccountSettingsSection = ({
  activeSection,
}: AccountSettingsSection): React.ReactElement => {
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
  let selectedTabContent = null
  switch (activeSection) {
    case TabOptions.changePassword:
      selectedTabContent = <ChangePasswordForm />
      break
    case TabOptions.changeLanguage:
      selectedTabContent = <ChangeLanguageForm />
      break
    case TabOptions.changeCompanyData:
      selectedTabContent = <ChangeCompanyDetails />
      break
    case TabOptions.editAccount:
      selectedTabContent = <EditAccount />
      break
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
          label={t('accountSettings.changeCompanyDataForm.tabTitle')}
          href={ROUTES.accountSettingsChangeCompanyData}
        />
        <LinkTab
          label={t('accountSettings.changeLanguageForm.tabTitle')}
          href={ROUTES.accountSettingsChangeLanguage}
        />
        <LinkTab
          label={t('accountSettings.editAccountForm.title')}
          href={ROUTES.accountSettingsEditAccount}
        />
      </Tabs>
      <Box sx={formColumnSx}>{selectedTabContent}</Box>
    </Box>
  )
}
