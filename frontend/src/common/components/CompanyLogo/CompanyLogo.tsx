import { Box, Button } from '@mui/material'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import React from 'react'

import { logoWrapperSx } from './CompanyLogo.styles'

export interface CompanyLogo {
  imageSrc?: string
  onLogoClick?: () => void
}

export const CompanyLogo = ({
  imageSrc,
  onLogoClick,
}: CompanyLogo): React.ReactElement => {
  const { t } = useTranslation()
  return (
    <div onClick={onLogoClick}>
      <Box sx={logoWrapperSx}>
        {imageSrc ? (
          <>
            <Image
              src={imageSrc}
              alt={t('dashboard.companyLogo.companyLogoAlt')}
              objectFit={'cover'}
              width={172}
              height={172}
            />
            <Button
              className={'editLogo-button'}
              variant={'contained'}
              size={'small'}
              color={'secondary'}
            >
              {t('dashboard.companyLogo.editLogo')}
            </Button>
          </>
        ) : (
          <Button variant={'contained'} size={'small'} color={'secondary'}>
            {t('dashboard.companyLogo.addLogo')}
          </Button>
        )}
      </Box>
    </div>
  )
}
