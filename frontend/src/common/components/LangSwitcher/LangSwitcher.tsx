import { Language } from '@mui/icons-material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  Menu,
  ListItemIcon,
  Link,
  IconButton,
  Tooltip,
  MenuItem,
} from '@mui/material'
import { useTranslation } from 'next-i18next'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { MouseEvent, useState } from 'react'

const MENU_ID = 'language-menu'
const BUTTON_ID = 'language-menu-button'

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
      <Tooltip title={t('pageHeader.languageSwitch')}>
        <IconButton
          id={BUTTON_ID}
          onClick={handleClick}
          size={'small'}
          sx={{ ml: 2 }}
          aria-controls={open ? MENU_ID : undefined}
          aria-haspopup={'true'}
          aria-expanded={open ? 'true' : undefined}
        >
          <Language sx={{ color: 'common.white', width: 33, height: 33 }} />
          <KeyboardArrowDownIcon sx={{ color: 'common.white' }} />
        </IconButton>
      </Tooltip>
      <Menu
        id={MENU_ID}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': BUTTON_ID,
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
