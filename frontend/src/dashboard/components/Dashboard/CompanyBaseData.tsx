import { Box, Dialog, Grid, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/system'
import { useTranslation } from 'next-i18next'
import React, { Fragment, useCallback, useState } from 'react'

import { CompanyType, ImageType } from '@/api/__types__'
import { CompanyLogo } from '@/common/components/CompanyLogo'
import { distributorTypes } from '@/dashboard/components/Dashboard/constants'
import { UploadLogoDialogContent } from '@/dashboard/components/UploadLogoDiaologContent'
import { defaultGridSx } from '@/theme/layout'
import { fontWeights } from '@/theme/typography'

export interface CompanyBaseData {
  companyInformation: Omit<CompanyType, 'logo'> & {
    logo?: Pick<ImageType, 'url'> | null
  }
}

export const CompanyBaseData = ({
  companyInformation,
}: CompanyBaseData): React.ReactElement => {
  const [isUploadLogoDialogOpen, openUploadLogoDialog] =
    useState<boolean>(false)
  const { t } = useTranslation()
  const theme = useTheme()
  const dialogFullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const { name, ...companyBaseData } = companyInformation
  const preparedData = {
    identificationNumber: companyBaseData.identificationNumber,
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
                    `dashboard.companyBaseData.${key}`
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
