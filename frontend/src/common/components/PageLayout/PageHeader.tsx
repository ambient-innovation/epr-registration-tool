import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'
import { Stack, Drawer, useMediaQuery, Button, Divider } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import Toolbar from '@mui/material/Toolbar'
import { useTheme } from '@mui/system'
import { visuallyHidden } from '@mui/utils'
import { useTranslation } from 'next-i18next'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import { useUser } from '@/auth/hooks/useUser'
import { LangSwitcher } from '@/common/components/LangSwitcher'
import { MenuPage } from '@/common/components/PageLayout/types'
import { UserControls } from '@/common/components/UserControls'
import { ROUTES } from '@/routes'
import { pxToRemAsString } from '@/theme/utils'

import { Logo } from './Logo'
import {
  headerSx,
  listItemButtonSx,
  headerContainerSx,
} from './PageHeader.styles'

const MOBILE_MENU_ID = 'mobile-nav-menu'
export interface PageHeader {
  pages?: MenuPage[]
}

export const PageHeader = ({ pages }: PageHeader) => {
  const [isMobileDrawerOpen, openMobileDrawer] = React.useState(false)

  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const router = useRouter()
  const { t } = useTranslation()
  const { loggedIn } = useUser()

  useEffect(() => {
    if (isDesktop) {
      openMobileDrawer(false)
    }
  }, [isDesktop])

  const mobileDrawer = (
    <Drawer
      anchor={'top'}
      open={isMobileDrawerOpen}
      hideBackdrop={true}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        zIndex: 'mobileStepper',
        top: pxToRemAsString(88),
      }}
      PaperProps={{
        sx: {
          top: 0,
          position: 'absolute',
          width: '100%',
          height: '100%',
          color: 'common.white',
        },
      }}
    >
      <Box component={'nav'} sx={headerContainerSx}>
        <Button
          variant={'inverted'}
          sx={{
            '&:not(:focus):not(:active)': visuallyHidden,
            position: 'absolute',
            top: pxToRemAsString(8),
            right: pxToRemAsString(32),
          }}
          onClick={() => openMobileDrawer(false)}
        >
          {t('pageHeader.close')}
        </Button>
        <Stack spacing={5} width={'100%'} alignItems={'flex-start'}>
          {!!pages?.length && (
            <List>
              {pages?.map((page) => (
                <ListItem key={page.title} disablePadding sx={{ my: 6 }}>
                  <NextLink href={page.href} locale={router.locale} passHref>
                    <ListItemButton
                      component={'a'}
                      sx={listItemButtonSx}
                      selected={router.asPath === page.href}
                      onClick={() => openMobileDrawer(false)}
                    >
                      {page.title}
                    </ListItemButton>
                  </NextLink>
                </ListItem>
              ))}
            </List>
          )}
          <Divider sx={{ width: '100%', bgcolor: 'common.white' }} />
          <Box>
            <LangSwitcher showLabel={true} />
          </Box>
          {!loggedIn && (
            <Box>
              <NextLink
                href={ROUTES.registration}
                locale={router.locale}
                passHref
              >
                <Button
                  component={'a'}
                  variant={'inverted'}
                  onClick={() => openMobileDrawer(false)}
                >
                  {t('register')}
                </Button>
              </NextLink>
            </Box>
          )}
        </Stack>
      </Box>
    </Drawer>
  )
  return (
    <Box component={'header'} sx={headerSx}>
      <Box sx={headerContainerSx}>
        <AppBar
          position={'relative'}
          component={'div'} // default is <header> (avoid duplicate)
          sx={{ boxShadow: 'none' }}
        >
          <Toolbar>
            <Box sx={{ mr: 11 }}>
              <Logo />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              {!!pages?.length && (
                <List
                  role={'navigation'}
                  sx={{
                    display: {
                      xs: 'none',
                      md: 'inline-flex',
                      flexWrap: 'wrap',
                    },
                  }}
                >
                  {pages?.map((page) => (
                    <ListItem
                      key={page.title}
                      disablePadding
                      sx={{ mx: 2, width: 'auto' }}
                    >
                      <NextLink href={page.href} passHref>
                        <ListItemButton
                          component={'a'}
                          sx={listItemButtonSx}
                          selected={router.asPath === page.href}
                        >
                          {page.title}
                        </ListItemButton>
                      </NextLink>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
            <Stack
              sx={{ flexGrow: 0 }}
              alignItems={'center'}
              direction={'row'}
              spacing={6}
            >
              <UserControls showRegistrationButton={!isMobile} />
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <LangSwitcher />
              </Box>
              <Box sx={{ display: { sm: 'block', md: 'none' } }}>
                {isMobileDrawerOpen ? (
                  <IconButton
                    sx={{ padding: 0 }}
                    aria-controls={MOBILE_MENU_ID}
                    onClick={() => openMobileDrawer(false)}
                    color={'inherit'}
                  >
                    <CloseIcon sx={{ width: 33, height: 33 }} />
                  </IconButton>
                ) : (
                  <IconButton
                    sx={{ padding: 0 }}
                    aria-controls={MOBILE_MENU_ID}
                    aria-haspopup={'true'}
                    onClick={() => openMobileDrawer(true)}
                    color={'inherit'}
                  >
                    <MenuIcon sx={{ width: 33, height: 33 }} />
                  </IconButton>
                )}
              </Box>
            </Stack>
          </Toolbar>
        </AppBar>
      </Box>
      {mobileDrawer}
    </Box>
  )
}
