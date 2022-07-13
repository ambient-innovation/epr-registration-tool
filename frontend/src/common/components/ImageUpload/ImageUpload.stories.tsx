import { Story } from '@storybook/react'

import { ImageUpload } from './ImageUpload'

export default {
  title: 'Common/ImageUpload',
  component: ImageUpload,
}

const Template: Story<ImageUpload> = (args) => {
  return <ImageUpload {...args} />
}

export const Default = Template.bind({})
Default.args = {
  uploadButtonText: 'Upload Logo',
  deleteButtonText: 'Delete Picture',
  imageAlt: 'logo example',
}
