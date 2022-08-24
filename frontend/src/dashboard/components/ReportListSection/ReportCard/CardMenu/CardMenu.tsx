import { Delete } from '@mui/icons-material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  Button,
  Dialog,
  DialogContent,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/system'
import { useTranslation } from 'next-i18next'
import { MouseEvent, useCallback, useId, useState } from 'react'

import { usePackagingReportForecastDeleteMutation } from '@/api/__types__'
import { ApolloErrorAlert } from '@/common/components/ApolloErrorAlert'
import { PACKAGING_REPORTS_QUERY } from '@/dashboard/components/ReportListSection/queries'
import { fontWeights } from '@/theme/typography'

export type CardMenu = {
  reportId: string
  canDelete: boolean
}

export const CardMenu = ({ canDelete, reportId }: CardMenu) => {
  const menuId = useId()
  const { t } = useTranslation()
  const theme = useTheme()
  const dialogFullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)
  const [isDeleteDialogOpen, openDeleteDialog] = useState<boolean>(false)

  const [packagingReportDelete, { loading, error: apolloError }] =
    usePackagingReportForecastDeleteMutation({
      refetchQueries: [PACKAGING_REPORTS_QUERY],
    })

  const closeDialog = useCallback(() => {
    openDeleteDialog(false)
  }, [])

  const open = Boolean(anchorEl)

  const handleClick = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    packagingReportDelete({
      variables: {
        packagingReportId: reportId,
      },
    })
      // handle error via error object returned by useMutation
      .catch(() => null)
  }

  return (
    <>
      <IconButton
        size={'small'}
        onClick={handleClick}
        aria-controls={open ? menuId : undefined}
        aria-expanded={open ? 'true' : undefined}
      >
        <MoreVertIcon sx={{ width: 33, height: 33 }} />
      </IconButton>
      <Menu
        id={menuId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 5,
          sx: {
            borderRadius: 2,
            mt: 2,
          },
        }}
      >
        <MenuItem onClick={() => openDeleteDialog(true)} disabled={!canDelete}>
          <ListItemIcon>
            <Delete
              sx={{
                color: 'error.main',
              }}
            />
          </ListItemIcon>
          <Typography
            variant={'body1'}
            component={'span'}
            fontWeight={fontWeights.regular}
            color={'error.main'}
          >
            {t('dashboard.reportListSection.deleteReport')}
          </Typography>
        </MenuItem>
      </Menu>
      <Dialog open={isDeleteDialogOpen} fullScreen={dialogFullScreen}>
        <DialogContent>
          <Stack spacing={8}>
            <Typography variant={'h3'}>
              {t('dashboard.reportListSection.deleteReport')}
            </Typography>
            <Typography variant={'body2'}>
              {t('dashboard.reportListSection.deleteReportDialog.description')}
            </Typography>
            {apolloError && <ApolloErrorAlert error={apolloError} />}
            <Stack direction={'row'} spacing={6} justifyContent={'flex-end'}>
              <Button
                variant={'contained'}
                color={'error'}
                onClick={handleDelete}
                startIcon={<Delete />}
                disabled={loading}
              >
                <Typography
                  variant={'body2'}
                  component={'span'}
                  color={'primary.contrastText'}
                >
                  {loading ? t('loading') : t('delete')}
                </Typography>
              </Button>
              <Button variant={'text'} onClick={closeDialog}>
                {t('cancel')}
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  )
}
