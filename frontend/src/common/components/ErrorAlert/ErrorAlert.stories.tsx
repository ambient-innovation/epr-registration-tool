import { Meta, Story } from '@storybook/react'

import { ErrorAlert } from './ErrorAlert'

export default {
  title: 'common/ErrorAlert',
  component: ErrorAlert,
} as Meta<ErrorAlert>

const Template: Story<ErrorAlert & { message: string }> = ({
  children: _,
  message,
  ...args
}) => {
  return <ErrorAlert {...args}>{message}</ErrorAlert>
}

export const Default = Template.bind({})
Default.args = {
  title: '',
  message: 'Hello World',
}
