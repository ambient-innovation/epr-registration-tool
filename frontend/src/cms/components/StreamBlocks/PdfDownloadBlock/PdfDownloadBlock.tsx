import FileDownloadRounded from '@mui/icons-material/FileDownloadRounded'
import {
  Box,
  Link,
  List,
  ListItem,
  ListItemIcon,
  Typography,
} from '@mui/material'
import React from 'react'

import { BaseBlock } from '@/cms/components/StreamBlocks/BaseBlock'
import { downloadListGrid } from '@/cms/components/StreamBlocks/PdfDownloadBlock/PdfDownloadBlock.styles'
import { HeadingWithTextAndCta } from '@/cms/components/StreamBlocks/TextBlock'
import { PdfDownloadBlockData } from '@/cms/types'
import { defaultContainerSx } from '@/theme/layout'
import { pxToRemAsString } from '@/theme/utils'
import { bytesToSize } from '@/utils/files.utils'

export type PdfDownloadBlock = PdfDownloadBlockData['value']

const FileList = (files: PdfDownloadBlock['files']): React.ReactElement => {
  return (
    <Box>
      <List sx={downloadListGrid}>
        {Object.entries(files).map(([id, { title, url, fileSize }]) => {
          return (
            <ListItem
              key={id}
              disableGutters
              component={Link}
              href={url}
              target={'_blank'}
              download
            >
              <ListItemIcon sx={{ minWidth: pxToRemAsString(25), mr: 4 }}>
                <FileDownloadRounded
                  sx={{ color: 'primary.main' }}
                  fontSize={'small'}
                />
              </ListItemIcon>
              <Typography
                sx={{
                  color: 'primary.main',
                  textDecoration: 'underline',
                  fontWeight: 700,
                }}
                variant={'body1'}
              >
                {`${title} (${bytesToSize(fileSize)})`}
              </Typography>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )
}

export const PdfDownloadBlock = ({
  text,
  files,
}: PdfDownloadBlock): React.ReactElement => {
  return (
    <BaseBlock>
      <Box sx={defaultContainerSx}>
        <Box>
          <HeadingWithTextAndCta orientation={'left'} {...text} />
        </Box>
        <Box mt={11}>
          <FileList {...files} />
        </Box>
      </Box>
    </BaseBlock>
  )
}
