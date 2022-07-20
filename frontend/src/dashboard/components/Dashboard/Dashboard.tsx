import {
  Alert,
  Box,
  Grid,
  Skeleton,
  Typography,
  Dialog,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/system'
import { useTranslation } from 'next-i18next'
import { Fragment } from 'react'
import React, { useState, useCallback } from 'react'

import { CompanyType, ImageType, useCompanyDetailsQuery } from '@/api/__types__'
import { useUser } from '@/auth/hooks/useUser'
import { CompanyLogo } from '@/common/components/CompanyLogo'
import { CompletionAlert } from '@/dashboard/components/Dashboard/CompletionAltert'
import { DashboardHeader } from '@/dashboard/components/Dashboard/DashboardHeader'
import { ReportListSection } from '@/dashboard/components/ReportListSection'
import { defaultContainerSx, defaultGridSx } from '@/theme/layout'
import { fontWeights } from '@/theme/typography'

import { UploadLogoDialogContent } from '../UploadLogoDiaologContent'
import { distributorTypes } from './constants'

export type Dashboard = Record<string, never>
export interface BaseData {
  companyInformation: Omit<CompanyType, 'logo'> & {
    logo?: Pick<ImageType, 'url'> | null
  }
}

const BaseData = ({ companyInformation }: BaseData): React.ReactElement => {
  const [isUploadLogoDialogOpen, openUploadLogoDialog] =
    useState<boolean>(false)
  const { t } = useTranslation()
  const theme = useTheme()
  const dialogFullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const { name, ...companyBaseData } = companyInformation
  const preparedData = {
    registrationNumber: companyBaseData.identificationNumber || 'Not set',
    distributorType: distributorTypes(t)[companyBaseData.distributorType],
    createdAt: new Date(companyBaseData.createdAt).toLocaleDateString(),
    lastmodifiedAt: new Date(
      companyBaseData.lastmodifiedAt
    ).toLocaleDateString(),
  }

  const closeDialog = useCallback(() => {
    openUploadLogoDialog(false)
  }, [])

  return (
    <>
      <Box sx={[defaultGridSx]}>
        <Box sx={{ mb: { xs: 8, sm: 0 } }}>
          <CompanyLogo
            imageSrc={companyInformation.logo?.url}
            onLogoClick={() => openUploadLogoDialog(true)}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1 ', sm: '2 / -1' } }}>
          <Typography variant={'h2'}>{name}</Typography>
          <Grid container sx={{ mt: 6 }}>
            {Object.entries(preparedData).map(([key, value]) => (
              <Fragment key={key}>
                <Grid item xs={6} md={3}>
                  <Typography variant={'body2'}>{`${t(
                    `dashboard.${key}`
                  )}:`}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant={'body2'} fontWeight={fontWeights.bold}>
                    {value}
                  </Typography>
                </Grid>
              </Fragment>
            ))}
          </Grid>
        </Box>
      </Box>
      <Dialog open={isUploadLogoDialogOpen} fullScreen={dialogFullScreen}>
        <UploadLogoDialogContent
          onCancel={closeDialog}
          onSave={closeDialog}
          currentLogoUrl={companyInformation.logo?.url}
        />
      </Dialog>
    </>
  )
}

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
            <BaseData companyInformation={companyDetails} />
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
