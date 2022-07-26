import { Language } from '@mui/icons-material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  Menu,
  ListItemIcon,
  Link,
  IconButton,
  Tooltip,
  MenuItem,
  Stack,
} from '@mui/material'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'next-i18next'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { MouseEvent, useState } from 'react'

import { getLanguageOptions } from '@/common/contants'

const MENU_ID = 'language-menu'
const BUTTON_ID = 'language-menu-button'

export type LangSwitcher = {
  showLabel?: boolean
}

export const LangSwitcher = ({ showLabel }: LangSwitcher) => {
  const { locale, pathname, query } = useRouter()
  const { t } = useTranslation()

  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)
  const open = Boolean(anchorEl)

  const languages = getLanguageOptions()
  const enOption = languages[0]
  const arOption = languages[1]

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
          sx={{ color: 'common.white' }}
          aria-controls={open ? MENU_ID : undefined}
          aria-haspopup={'true'}
          aria-expanded={open ? 'true' : undefined}
        >
          <Stack
            component={'span'}
            spacing={3}
            direction={'row'}
            alignItems={'center'}
          >
            <Language sx={{ color: 'common.white', width: 33, height: 33 }} />
            {showLabel && (
              <Typography component={'span'}>
                {languages.find((language) => language.value === locale)?.label}
              </Typography>
            )}
            <KeyboardArrowDownIcon sx={{ color: 'common.white' }} />
          </Stack>
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
        <MenuItem disabled={locale === enOption.value}>
          <ListItemIcon>{'🇬🇧'}</ListItemIcon>
          <NextLink href={{ pathname, query }} locale={enOption.value} passHref>
            <Link> {enOption.label}</Link>
          </NextLink>
        </MenuItem>
        <MenuItem disabled={locale === arOption.value}>
          <ListItemIcon>{'🇯🇴'}</ListItemIcon>
          <NextLink href={{ pathname, query }} locale={arOption.value} passHref>
            <Link> {arOption.label}</Link>
          </NextLink>
        </MenuItem>
      </Menu>
    </>
  )
}
