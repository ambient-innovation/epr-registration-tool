import { Box, Button, Link, CircularProgress, Stack } from '@mui/material'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import React, { useEffect } from 'react'

import { ErrorAlert } from '@/common/components/ErrorAlert'
import { pxToRemAsString } from '@/theme/utils'

import { useCompressedImage } from './useCompressedImage'

export interface ImageUpload {
  onChangeImageFile: (file: File | null | undefined) => void
  uploadButtonText: string
  deleteButtonText: string
  currentImageUrl?: string
  imageAlt?: string
}

export const ImageUpload = ({
  onChangeImageFile,
  uploadButtonText,
  deleteButtonText,
  currentImageUrl,
  imageAlt,
}: ImageUpload): React.ReactElement => {
  const { isCompressing, image, imageURL, updateImage, progress, isError } =
    useCompressedImage()

  const { t } = useTranslation()
  useEffect(() => {
    onChangeImageFile(image)
  }, [image, onChangeImageFile])

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const files = e.currentTarget?.files

    if (files) {
      updateImage(files[0])
      // reset input value to be able to select the same image again after deletion
      // https://github.com/ngokevin/react-file-reader-input/issues/11
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      e.target.value = null
    }
  }
  const handleDelete = () => {
    updateImage(null)
  }
  const deleteImage = image === null
  return (
    <Stack direction={'column'} spacing={6} alignItems={'center'}>
      <Box
        sx={{
          width: pxToRemAsString(172),
        }}
      >
        <Box
          sx={{
            bgcolor: 'background.light',
            height: pxToRemAsString(172),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            borderRadius: pxToRemAsString(6),
          }}
        >
          {isCompressing ? (
            <CircularProgress variant={'determinate'} value={progress} />
          ) : !deleteImage && (imageURL || currentImageUrl) ? (
            <Image
              src={imageURL || currentImageUrl || ''}
              alt={imageAlt}
              objectFit={'cover'}
              width={172}
              height={172}
              css={{ borderRadius: 3 }}
            />
          ) : (
            <Button component={'label'} variant={'contained'} size={'small'}>
              {uploadButtonText}
              <input
                onChange={handleChange}
                hidden
                accept={'image/*'}
                type={'file'}
              />
            </Button>
          )}
        </Box>
        {imageURL || currentImageUrl ? (
          <Box
            sx={{
              mt: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Link
              role={'button'}
              tabIndex={0}
              color={'error.main'}
              onClick={handleDelete}
              sx={{ cursor: 'pointer' }}
            >
              {deleteButtonText}
            </Link>
          </Box>
        ) : null}
      </Box>
      {isError && (
        <ErrorAlert>{t('internalErrors.imageUploadError')}</ErrorAlert>
      )}
    </Stack>
  )
}
