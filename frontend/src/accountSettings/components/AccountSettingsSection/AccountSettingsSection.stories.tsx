import { Story, Meta } from '@storybook/react'

import { MockUserProvider } from '@/auth/hooks/useUser'
import { mockUser } from '@/auth/mocks'

import { AccountSettingsSection, TabOptions } from './AccountSettingsSection'
import { companyDetailsWithContactMock } from './ChangeCompanyData/mocks'

export default {
  title: 'Account-Settings/AccountSettingsSection',
  component: AccountSettingsSection,
  parameters: {
    apolloClient: {
      mocks: [companyDetailsWithContactMock],
    },
  },
} as Meta<AccountSettingsSection>

const Template: Story<AccountSettingsSection> = (args) => {
  return <AccountSettingsSection {...args} />
}

export const ChangePassword = Template.bind({})
ChangePassword.args = {
  activeSection: TabOptions.changePassword,
}
export const ChangeCompanyData = Template.bind({})
ChangeCompanyData.args = {
  activeSection: TabOptions.changeCompanyData,
}

export const ChangeLanguage: Story<AccountSettingsSection> = (args) => {
  return (
    <MockUserProvider user={mockUser}>
      <AccountSettingsSection {...args} />
    </MockUserProvider>
  )
}

ChangeLanguage.args = {
  activeSection: TabOptions.changeLanguage,
}
