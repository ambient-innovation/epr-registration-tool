import { Typography, DialogContent, Stack, Button } from '@mui/material'
import { useTranslation } from 'next-i18next'
import React, { useState, useCallback } from 'react'

import { useChangeCompanyLogoMutation } from '@/api/__types__'
import { ApolloErrorAlert } from '@/common/components/ApolloErrorAlert'
import { ImageUpload } from '@/common/components/ImageUpload'

import { COMPANY_DETAILS } from '../Dashboard/queries'

export type UploadLogoDialogContent = {
  onCancel?: () => void
  onSave?: () => void
  currentLogoUrl?: string
}

export const UploadLogoDialogContent = ({
  onCancel,
  onSave,
  currentLogoUrl,
}: UploadLogoDialogContent): React.ReactElement => {
  const { t } = useTranslation()
  const [changeCompanyLogo, { error: apolloError, loading }] =
    useChangeCompanyLogoMutation()
  //  initial state: undefined, delete image: null, upload new image: File
  const [imageFile, setImageFile] = useState<undefined | null | File>(undefined)

  const handleSave = async () => {
    try {
      await changeCompanyLogo({
        variables: {
          file: imageFile,
        },
        refetchQueries: [{ query: COMPANY_DETAILS }],
      })
      //  reset image file state
      setImageFile(undefined)
      onSave && onSave()
    } catch {
      // handle error via error object returned by useMutation
    }
  }
  const handleChangeImageFile = useCallback(
    (image: File | null | undefined) => {
      setImageFile(image)
    },
    []
  )
  // state is considered untouched if
  // - imageFile is undefined (initial state)
  // - imageFile is null (delete mode) and the currentLogoUrl is unset
  const isUntouched =
    imageFile === undefined || (imageFile === null && !currentLogoUrl)
  return (
    <DialogContent sx={{ px: 8, py: 6 }}>
      <Stack spacing={8}>
        <Typography variant={'h3'}>
          {t('dashboard.uploadCompanyLogoDialog.title')}{' '}
        </Typography>
        <Typography variant={'body2'}>
          {t('dashboard.uploadCompanyLogoDialog.description')}
        </Typography>
        <ImageUpload
          deleteButtonText={t('dashboard.uploadCompanyLogoDialog.deleteLogo')}
          uploadButtonText={t('dashboard.uploadCompanyLogoDialog.uploadLogo')}
          onChangeImageFile={handleChangeImageFile}
          currentImageUrl={currentLogoUrl}
          imageAlt={t('dashboard.uploadCompanyLogoDialog.companyLogoAlt')}
        />
        {apolloError && <ApolloErrorAlert error={apolloError} />}
        <Stack direction={'row'} spacing={6} justifyContent={'flex-end'}>
          <Button variant={'text'} onClick={onCancel}>
            {t('dashboard.uploadCompanyLogoDialog.cancel')}
          </Button>
          <Button
            variant={'contained'}
            onClick={handleSave}
            disabled={isUntouched || loading}
          >
            {loading
              ? t('loading')
              : t('dashboard.uploadCompanyLogoDialog.save')}
          </Button>
        </Stack>
      </Stack>
    </DialogContent>
  )
}
