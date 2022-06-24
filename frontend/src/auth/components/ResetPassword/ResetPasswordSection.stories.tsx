import { Story, Meta } from '@storybook/react'

import { ResetPasswordSection } from './ResetPasswordSection'

export default {
  title: 'auth/ResetPasswordSection',
  component: ResetPasswordSection,
} as Meta<ResetPasswordSection>

const Template: Story<ResetPasswordSection> = (args) => (
  <ResetPasswordSection {...args} />
)

export const Default = Template.bind({})
