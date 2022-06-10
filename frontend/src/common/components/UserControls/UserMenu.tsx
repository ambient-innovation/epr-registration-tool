import { Logout } from '@mui/icons-material'
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material'
import { useTranslation } from 'next-i18next'
import NextLink from 'next/link'
import { MouseEvent, useState } from 'react'

import { useUser } from '@/auth/hooks/useUser'
import { ROUTES } from '@/routes'
import { fontWeights } from '@/theme/typography'

const menuId = 'account-menu'

export const UserMenu = () => {
  const { t } = useTranslation()
  const { logout } = useUser()

  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Box>
        <Tooltip title={t('pageHeader.userMenu')}>
          <IconButton
            onClick={handleClick}
            size={'small'}
            aria-controls={open ? menuId : undefined}
            aria-haspopup={'true'}
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar
              sx={{
                color: 'primary.main',
                bgcolor: 'common.white',
                width: 33,
                height: 33,
              }}
            />
            <KeyboardArrowDownIcon sx={{ color: 'common.white' }} />
          </IconButton>
        </Tooltip>
      </Box>
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
        <NextLink href={ROUTES.dashboard}>
          <MenuItem>
            <ListItemIcon>
              <DashboardCustomizeIcon
                fontSize={'small'}
                sx={{
                  marginRight: '2rem',
                  color: 'primary.main',
                }}
              />
            </ListItemIcon>
            <Typography
              variant={'body1'}
              component={'span'}
              fontWeight={fontWeights.regular}
              color={'primary.main'}
            >
              {t('dashboard.main')}
            </Typography>
          </MenuItem>
        </NextLink>
        <MenuItem onClick={() => logout()}>
          <ListItemIcon>
            <Logout
              fontSize={'small'}
              sx={{
                marginRight: '2rem',
                color: 'primary.main',
              }}
            />
          </ListItemIcon>
          <Typography
            variant={'body1'}
            component={'span'}
            fontWeight={fontWeights.regular}
            color={'primary.main'}
          >
            {t('logout')}
          </Typography>
        </MenuItem>
      </Menu>
    </>
  )
}
