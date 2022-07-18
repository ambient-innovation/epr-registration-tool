import { Box } from '@mui/material'
import { Story } from '@storybook/react'

import { ReportListSection } from './ReportListSection'
import { ReportListSkeleton } from './ReportListSkeleton'
import {
  packagingReports2022Mock,
  packagingReportsEmpyMock,
  packagingReportsMock,
} from './mockReports'

export default {
  title: 'dashboard/ReportListSection',
  component: ReportListSection,
}

const Template: Story<ReportListSection> = (args) => {
  return <ReportListSection {...args} />
}
export const WithReports = Template.bind({})
WithReports.args = {
  canAddReport: true,
}
WithReports.parameters = {
  apolloClient: {
    mocks: [packagingReportsMock, packagingReports2022Mock],
  },
}

export const WithoutReportsIncomplete = Template.bind({})
WithoutReportsIncomplete.args = {
  canAddReport: false,
}
WithoutReportsIncomplete.parameters = {
  apolloClient: {
    mocks: [packagingReportsEmpyMock],
  },
}

export const WithoutReports = Template.bind({})
WithoutReports.args = {
  canAddReport: true,
}
WithoutReports.parameters = {
  apolloClient: {
    mocks: [packagingReportsEmpyMock],
  },
}

export const Skeleton = (): React.ReactElement => {
  return (
    <Box p={8}>
      <ReportListSkeleton />
    </Box>
  )
}
