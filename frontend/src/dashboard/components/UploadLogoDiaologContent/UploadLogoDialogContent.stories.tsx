import { Dialog } from '@mui/material'
import { Story } from '@storybook/react'

import { UploadLogoDialogContent } from './UploadLogoDialogContent'

export default {
  title: 'Dashboard/UploadLogoDialog',
  component: UploadLogoDialogContent,
}

const Template: Story<UploadLogoDialogContent> = (args) => {
  return (
    <Dialog open={true}>
      <UploadLogoDialogContent {...args} />
    </Dialog>
  )
}

export const Default = Template.bind({})
Default.args = {}
