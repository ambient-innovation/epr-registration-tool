import {
  Box,
  Button,
  Divider,
  Pagination,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useEffect, useId, useState } from 'react'

import {
  PackagingReportsSortingOption as SortingOption,
  usePackagingReportsQuery,
} from '@/api/__types__'
import { ApolloErrorAlert } from '@/common/components/ApolloErrorAlert'
import { DEFAULT_FORM_SPACING } from '@/common/components/FormStep/constants'
import { SelectField } from '@/common/components/SelectField'
import { ROUTES } from '@/routes'

import { ReportCard } from './ReportCard/ReportCard'
import {
  backgroundSx,
  containerSx,
  filterFieldSx,
  paginationContainerSx,
} from './ReportListSection.styles'
import { ReportListSkeleton } from './ReportListSkeleton'
import { getSortingOptions, LIST_SPACING } from './constatns'

export interface ReportListSection {
  canAddReport: boolean
}

const MAX_ITEMS = 12

// 1900 and 2099 are the default min/max dates of DatePicker
const MIN_YEAR = 1900
const MAX_YEAR = 2099

export const ReportListSection = ({
  canAddReport,
}: ReportListSection): React.ReactElement => {
  const { t } = useTranslation()

  const sortingOptions = getSortingOptions(t)

  const defaultSorting = sortingOptions[0].value

  const [filterDate, setFilterDate] = useState<null | Date>(null)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [sorting, setSorting] = useState<SortingOption>(defaultSorting)

  const resetFilterAndSorting = () => {
    setSorting(defaultSorting)
    setFilterDate(null)
    setPageNumber(1)
  }

  const filterIsTouched = !!filterDate || sorting !== defaultSorting

  const year = filterDate?.getFullYear()

  const { data, loading, error } = usePackagingReportsQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      pagination: {
        page: pageNumber,
        limit: MAX_ITEMS,
      },
      filter: {
        year: year && year >= MIN_YEAR && year <= MAX_YEAR ? year : null,
      },
      sorting: sorting,
    },
  })

  const titleId = useId()
  const descriptionId = useId()

  const currentData = data
  const packagingReports = currentData?.packagingReports.items
  const pageInfo = currentData?.packagingReports.pageInfo

  useEffect(() => {
    // reset pagination to page 1, when currently selected page exceeds
    // available number of pages
    if (pageInfo && pageInfo.numPages < pageNumber && pageNumber !== 1) {
      setPageNumber(1)
    }
  }, [pageInfo, pageNumber])

  return (
    <Box
      component={'section'}
      sx={containerSx}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <Box sx={[backgroundSx, { gridColumn: '1 / -1' }]}>
        <Typography component={'h2'} variant={'h2'} id={titleId}>
          {t('dashboard.reportListSection.headline')}
        </Typography>
        <Typography sx={{ mt: 6 }} variant={'body1'} id={descriptionId}>
          {t('dashboard.reportListSection.description')}
        </Typography>
        <Stack
          // for some reason the spacing does not work correctly, whe not
          // specifying the direction for `md`  too
          direction={{ xs: 'column', sm: 'row', md: 'row' }}
          spacing={DEFAULT_FORM_SPACING}
          alignItems={{ sm: 'center' }}
          sx={{
            mt: 8,
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              views={['year']}
              label={t('common:dashboard.reportListSection.filterByYear')}
              value={filterDate}
              onChange={(date) => setFilterDate(date)}
              renderInput={(params) => (
                <TextField {...params} sx={filterFieldSx} />
              )}
            />
          </LocalizationProvider>
          <SelectField
            label={t('common:dashboard.reportListSection.sorting')}
            options={sortingOptions}
            value={sorting}
            onChange={(e) => setSorting(e.target.value as SortingOption)}
            sx={filterFieldSx}
          />
          {filterIsTouched && (
            <Button variant={'outlined'} onClick={resetFilterAndSorting}>
              {t('reset')}
            </Button>
          )}
        </Stack>
        {error && (
          <Box sx={{ mt: 6 }}>
            <ApolloErrorAlert error={error} />
          </Box>
        )}
        <Box sx={{ my: 8 }}>
          <Divider />
        </Box>

        <Box>
          {loading && !packagingReports?.length ? (
            <ReportListSkeleton />
          ) : packagingReports?.length ? (
            <Stack spacing={LIST_SPACING} role={'list'}>
              {packagingReports.map((report) => {
                return <ReportCard key={report.id} {...report} />
              })}
            </Stack>
          ) : filterIsTouched ? (
            <Stack>
              <Button
                variant={'outlined'}
                color={'primary'}
                onClick={resetFilterAndSorting}
              >
                {t('dashboard.reportListSection.noResultsResetFilter')}
              </Button>
            </Stack>
          ) : canAddReport ? (
            <Stack>
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
            </Stack>
          ) : (
            <Stack>
              <Button
                component={'div'}
                sx={{ cursor: 'not-allowed' }}
                variant={'inverted'}
                color={'primary'}
              >
                {t('dashboard.reportListSection.noReportPleaseComplete')}
              </Button>
            </Stack>
          )}
        </Box>
        <Box sx={paginationContainerSx}>
          <Pagination
            variant={'outlined'}
            count={pageInfo?.numPages || 5}
            page={pageNumber}
            onChange={(_, pageNumber) => setPageNumber(pageNumber)}
            disabled={!pageInfo || pageInfo.numPages < 2}
          />
        </Box>
      </Box>
    </Box>
  )
}
