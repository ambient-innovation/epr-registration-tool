import { Box, Stack, TextField } from '@mui/material'
import { Story } from '@storybook/react'
import { FormStep } from 'src/common/components/FormStep/FormStep'

import { DEFAULT_FORM_SPACING } from '@/common/components/FormStep/constants'

export default {
  title: 'Common/FormStep',
  component: FormStep,
  properties: {
    layout: 'centered',
  },
}

const Template: Story<FormStep> = (args) => {
  return (
    <Box maxWidth={'40rem'}>
      <FormStep {...args}>
        <Stack spacing={DEFAULT_FORM_SPACING}>
          <TextField label={'Field 1'} />
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={DEFAULT_FORM_SPACING}
            sx={{
              '*:first-of-type': {
                flexBasis: {
                  sm: '50%',
                  md: '30%',
                },
              },
              '*:last-of-type': {
                flexGrow: 1,
              },
            }}
          >
            <TextField label={'Field 2'} />
            <TextField label={'Field 2'} />
          </Stack>
          <TextField label={'Field 4'} />
        </Stack>
      </FormStep>
    </Box>
  )
}

export const Default = Template.bind({})
Default.args = {
  title: 'Title of form',
  description:
    'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
}
