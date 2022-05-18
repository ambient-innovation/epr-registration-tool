import { Typography } from '@mui/material'
import { Meta, Story } from '@storybook/react'

import { FormLayout, FormLayoutContent } from './FormLayout'

export default {
  title: 'common/MultiStepForm/Layout',
  component: FormLayout,
} as Meta<FormLayout>

const Template: Story<FormLayout> = () => {
  return (
    <FormLayout>
      <FormLayoutContent>
        <Typography variant={'h1'}>{'Hello 👋'}</Typography>
      </FormLayoutContent>
    </FormLayout>
  )
}

export const Default = Template.bind({})
Default.args = {}
