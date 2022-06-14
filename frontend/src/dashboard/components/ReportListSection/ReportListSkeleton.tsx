import { Skeleton, Stack } from '@mui/material'

import { LIST_SPACING } from './constatns'

const ReportCardSkeleton = (): React.ReactElement => {
  return (
    <Skeleton variant={'rectangular'} sx={{ height: { xs: 280, md: 170 } }} />
  )
}

export const ReportListSkeleton = (): React.ReactElement => {
  return (
    <Stack spacing={LIST_SPACING}>
      <ReportCardSkeleton />
      <ReportCardSkeleton />
      <ReportCardSkeleton />
    </Stack>
  )
}
