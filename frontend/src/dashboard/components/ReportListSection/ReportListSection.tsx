import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useId } from 'react'

import { usePackagingReportsQuery } from '@/api/__types__'
import { ApolloErrorAlert } from '@/common/components/ApolloErrorAlert'
import { ROUTES } from '@/routes'

import { ReportCard } from './ReportCard/ReportCard'
import { backgroundSx, containerSx } from './ReportListSection.styles'
import { ReportListSkeleton } from './ReportListSkeleton'
import { LIST_SPACING } from './constatns'

export interface ReportListSection {
  canAddReport: boolean
}

export const ReportListSection = ({
  canAddReport,
}: ReportListSection): React.ReactElement => {
  const { t } = useTranslation()
  const { data, loading, error } = usePackagingReportsQuery({
    fetchPolicy: 'cache-and-network',
  })
  const titleId = useId()
  const descriptionId = useId()
  return (
    <Box
      component={'section'}
      sx={containerSx}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <Box sx={[backgroundSx, { gridColumn: '1 / -1' }]}>
        <Typography component={'h2'} variant={'h5'} id={titleId}>
          {t('dashboard.reportListSection.headline')}
        </Typography>
        <Typography sx={{ mt: 6 }} variant={'body1'} id={descriptionId}>
          {t('dashboard.reportListSection.description')}
        </Typography>
        {error && (
          <Box sx={{ mt: 6 }}>
            <ApolloErrorAlert error={error} />
          </Box>
        )}
        <Divider sx={{ my: 8 }} />
        <Stack spacing={LIST_SPACING} role={'list'}>
          {loading ? (
            <ReportListSkeleton />
          ) : data?.packagingReports?.length ? (
            data?.packagingReports.map((report) => {
              return <ReportCard key={report.id} {...report} />
            })
          ) : canAddReport ? (
            <Link href={ROUTES.forecast} passHref>
              <Button
                component={'a'}
                variant={'inverted'}
                color={'primary'}
                disabled={!canAddReport}
              >
                {t('dashboard.reportListSection.noReportAddNow')}
              </Button>
            </Link>
          ) : (
            <Button
              component={'div'}
              sx={{ cursor: 'not-allowed' }}
              variant={'inverted'}
              color={'primary'}
            >
              {t('dashboard.reportListSection.noReportPleaseComplete')}
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  )
}
