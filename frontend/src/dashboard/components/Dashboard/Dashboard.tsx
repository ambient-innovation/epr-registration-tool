import { Alert, Box, Skeleton } from '@mui/material'
import { useTranslation } from 'next-i18next'
import React from 'react'

import { useCompanyDetailsQuery } from '@/api/__types__'
import { useUser } from '@/auth/hooks/useUser'
import { ReportListSection } from '@/dashboard/components/ReportListSection'
import { defaultContainerSx } from '@/theme/layout'

import { CompanyBaseData } from './CompanyBaseData'
import { CompletionAlert } from './CompletionAltert'
import { DashboardHeader } from './DashboardHeader'

export type Dashboard = Record<string, never>

export const Dashboard = (_: Dashboard): React.ReactElement => {
  const { t } = useTranslation()
  const { data, loading: loadingCompanyDetails } = useCompanyDetailsQuery()
  const companyDetails = data?.companyDetails
  const { user } = useUser()
  const canAddReport = !!companyDetails?.isProfileCompleted

  return (
    <>
      <Box sx={defaultContainerSx}>
        {!loadingCompanyDetails && user && !canAddReport && <CompletionAlert />}
        <DashboardHeader user={user} canAddReport={canAddReport} />
        <Box sx={{ marginTop: 11 }}>
          {!user || loadingCompanyDetails ? (
            <Skeleton
              variant={'rectangular'}
              sx={{ height: { xs: 300, sm: 172 } }}
            />
          ) : companyDetails ? (
            <CompanyBaseData companyInformation={companyDetails} />
          ) : (
            <Alert severity={'warning'}>
              {t('dashboard.noCompanyAssigned')}
            </Alert>
          )}
        </Box>
      </Box>
      <Box mt={11}>
        <ReportListSection canAddReport={canAddReport} />
      </Box>
    </>
  )
}
