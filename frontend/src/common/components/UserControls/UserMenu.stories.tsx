import { Box } from '@mui/material'
import { Story } from '@storybook/react'

import { UserMenu } from './UserMenu'

export default {
  title: 'Common/UserMenu',
  component: UserMenu,
  properties: {
    layout: 'centered',
  },
}

const Template: Story<typeof UserMenu> = () => {
  return (
    <Box textAlign={'center'} bgcolor={'primary.main'}>
      <UserMenu />
    </Box>
  )
}

export const Default = Template.bind({})
