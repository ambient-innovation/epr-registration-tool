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

import { ROUTES } from '@/routes'

export const LangSwitcher = () => {
  const { locale, pathname, query } = useRouter()
  const { t } = useTranslation()

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
        <NextLink href={ROUTES.registration} passHref>
          <Button component={'a'} variant={'inverted'}>
            {t('register')}
          </Button>
        </NextLink>
        <Tooltip title={'language switcher'}>
          <IconButton
            onClick={handleClick}
            size={'small'}
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup={'true'}
            aria-expanded={open ? 'true' : undefined}
          >
            <Language sx={{ color: 'common.white' }} />
          </IconButton>
        </Tooltip>
      </Stack>
      <Menu
        id={'basic-menu'}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 3,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1,
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
