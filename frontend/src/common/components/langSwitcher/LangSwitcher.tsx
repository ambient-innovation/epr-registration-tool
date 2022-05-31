import { Language } from '@mui/icons-material'
import {
  Menu,
  ListItemIcon,
  Link,
  Button,
  IconButton,
  Tooltip,
  Stack,
  MenuItem,
} from '@mui/material'
import { useTranslation } from 'next-i18next'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { MouseEvent, useState } from 'react'

import { useUser } from '@/auth/hooks/useUser'
import { UserMenu } from '@/common/components/UserMenu'
import { ROUTES } from '@/routes'
import { theme } from '@/theme'

const menuId = 'account-menu'

export const LangSwitcher = () => {
  const { locale, pathname, query } = useRouter()
  const { t } = useTranslation()
  const { loggedIn } = useUser()

  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent) => {
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Stack spacing={10} direction={'row'}>
        {!loggedIn ? (
          <>
            <NextLink href={ROUTES.login} passHref>
              <Button
                component={'a'}
                sx={{
                  color: theme.palette.common.white,
                  backgroundColor: theme.palette.primary.main,
                  border: `2px solid ${theme.palette.common.white}`,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                    border: `2px solid ${theme.palette.common.white}`,
                  },
                }}
              >
                {t('login')}
              </Button>
            </NextLink>
            <NextLink href={ROUTES.registration} passHref>
              <Button component={'a'} variant={'inverted'}>
                {t('register')}
              </Button>
            </NextLink>
          </>
        ) : (
          <UserMenu />
        )}
        <Tooltip title={t('paigeHeader.languageSwitch')}>
          <IconButton
            onClick={handleClick}
            size={'small'}
            sx={{ ml: 2 }}
            aria-controls={open ? menuId : undefined}
            aria-haspopup={'true'}
            aria-expanded={open ? 'true' : undefined}
          >
            <Language sx={{ color: 'common.white', width: 33, height: 33 }} />
          </IconButton>
        </Tooltip>
      </Stack>
      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        PaperProps={{
          elevation: 5,
          sx: {
            borderRadius: 2,
            mt: 2,
          },
        }}
      >
        <MenuItem disabled={locale === 'en'}>
          <ListItemIcon>{'🇬🇧'}</ListItemIcon>
          <NextLink href={{ pathname, query }} locale={'en'} passHref>
            <Link> {'English'}</Link>
          </NextLink>
        </MenuItem>
        <MenuItem disabled={locale === 'ar'}>
          <ListItemIcon>{'🇯🇴'}</ListItemIcon>
          <NextLink href={{ pathname, query }} locale={'ar'} passHref>
            <Link> {'عربي'}</Link>
          </NextLink>
        </MenuItem>
      </Menu>
    </>
  )
}
