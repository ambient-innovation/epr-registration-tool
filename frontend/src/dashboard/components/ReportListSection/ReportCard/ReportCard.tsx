import { Card, Chip, Typography, Box, Stack, Button } from '@mui/material'
import { useTranslation } from 'next-i18next'
import NextLink from 'next/link'

import { PackagingReportType } from '@/api/__types__'
import { timeframeDisplayValue } from '@/common/contants'
import { ROUTES } from '@/routes'

import { cardContentSx, statusChipSx } from './ReportCard.styles'

export type ReportCard = Pick<
  PackagingReportType,
  | 'id'
  | 'createdAt'
  | 'startMonth'
  | 'year'
  | 'timeframe'
  | 'packagingGroupsCount'
  | 'isForecastEditable'
  | 'isFinalReportSubmitted'
  | 'fees'
  | 'endDatetime'
>

export const ReportCard = ({
  id: reportId,
  createdAt,
  startMonth,
  year,
  timeframe,
  packagingGroupsCount,
  isForecastEditable,
  isFinalReportSubmitted,
  endDatetime,
  fees,
}: ReportCard): React.ReactElement => {
  const { t } = useTranslation()
  const startDate = new Date(year, startMonth - 1, 1)
  const formattedStartDate = startDate.toLocaleDateString()
  const formattedSubmitDate = new Date(createdAt).toLocaleDateString()
  // forecast is editable until end date
  const formattedEndDate = new Date(endDatetime).toLocaleDateString()

  const statusChip = (
    <Chip
      label={
        isFinalReportSubmitted
          ? 'Payment required'
          : t('dashboard.reportListSection.reportCard.forecast')
      }
      sx={{
        ...statusChipSx,
        backgroundColor: isFinalReportSubmitted ? 'warning.main' : 'info.main',
      }}
      role={'listitem'}
    />
  )
  const actionButton = isForecastEditable ? (
    <NextLink href={ROUTES.packagingReportChange(reportId)} passHref>
      <Button component={'a'} variant={'contained'}>
        {t('edit')}
      </Button>
    </NextLink>
  ) : !isFinalReportSubmitted ? (
    <NextLink href={ROUTES.packagingReportChange(reportId)} passHref>
      <Button component={'a'} variant={'contained'}>
        {'Submit Actual Quantities'}
      </Button>
    </NextLink>
  ) : (
    <NextLink href={ROUTES.dataReportView(reportId)} passHref>
      <Button component={'a'} variant={'inverted'}>
        {'view'}
      </Button>
    </NextLink>
  )

  const reportNumber = reportId

  return (
    <Card sx={{ boxShadow: 11, borderRadius: 3 }}>
      <Box sx={cardContentSx}>
        <Box
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <Typography variant={'h3'}>
            {t('dashboard.reportListSection.reportCard.title', {
              reportNumber,
            })}
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>{statusChip}</Box>
          <Box sx={{ ml: 'auto', display: { xs: 'none', md: 'block' } }}>
            {actionButton}
          </Box>
        </Box>
        <Typography variant={'caption'}>
          {`${t(
            'dashboard.reportListSection.reportCard.submittedOn'
          )} ${formattedSubmitDate}`}
        </Typography>
        <Box sx={{ display: { xs: 'block', sm: 'inline-block', md: 'none' } }}>
          {statusChip}
        </Box>

        <Stack direction={{ xs: 'column', md: 'row' }} mt={8} spacing={4}>
          <Box sx={{ flex: 1 }}>
            <Typography variant={'body2'}>
              {`${t('dashboard.reportListSection.reportCard.startsAt')} `}
              <Typography component={'span'} variant={'subtitle2'}>
                {formattedStartDate}
              </Typography>
            </Typography>
            <Typography variant={'body2'}>
              {`${t('dashboard.reportListSection.reportCard.timeframe')} `}
              <Typography component={'span'} variant={'subtitle2'}>
                {timeframeDisplayValue(t)[timeframe]}
              </Typography>
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant={'body2'}>
              {`${t(
                'dashboard.reportListSection.reportCard.entries'
              )} ${packagingGroupsCount}`}
            </Typography>
            {fees && (
              <Typography variant={'body2'}>
                {`${t(
                  'dashboard.reportListSection.reportCard.calculatedFees'
                )} `}
                <Typography component={'span'} variant={'subtitle2'}>
                  {`${fees} JOD`}
                </Typography>
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              flex: 1,
              textAlign: { md: 'right' },
              alignSelf: { md: 'flex-end' },
            }}
          >
            {isForecastEditable && (
              <Typography variant={'body2'} color={'text.disabled'}>
                {t('dashboard.reportListSection.reportCard.editableUntil', {
                  endDate: formattedEndDate,
                })}
              </Typography>
            )}
          </Box>
        </Stack>
        <Stack sx={{ mt: 10, display: { md: 'none' } }}>{actionButton}</Stack>
      </Box>
    </Card>
  )
}
