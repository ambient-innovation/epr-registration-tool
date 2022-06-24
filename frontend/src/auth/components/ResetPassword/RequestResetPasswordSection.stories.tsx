import { Story, Meta } from '@storybook/react'

import { RequestResetPasswordSection } from './RequestResetPasswordSection'

export default {
  title: 'auth/RequestResetPasswordSection',
  component: RequestResetPasswordSection,
} as Meta<RequestResetPasswordSection>

const Template: Story<RequestResetPasswordSection> = (args) => (
  <RequestResetPasswordSection {...args} />
)

export const Default = Template.bind({})
