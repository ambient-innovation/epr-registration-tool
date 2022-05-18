import { Typography } from '@mui/material'
import { Meta, Story } from '@storybook/react'
import {
  FormLayout,
  FormLayoutContent,
} from 'src/common/components/FormLayout/FormLayout'

export default {
  title: 'common/FormLayout',
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
