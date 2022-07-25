import { Button } from '@mui/material'
import { useTranslation } from 'next-i18next'
import NextLink from 'next/link'

import { useUser } from '@/auth/hooks/useUser'
import { ROUTES } from '@/routes'
import { theme } from '@/theme'

import { UserMenu } from './UserMenu'

export interface UserControls {
  showRegistrationButton?: boolean
  showUserMenu?: boolean
}

export const UserControls = ({
  showRegistrationButton = true,
  showUserMenu = true,
}: UserControls) => {
  const { t } = useTranslation()
  const { loggedIn, loading, logout } = useUser()

  if (loading) {
    return null
  }

  return !loggedIn ? (
    <>
      <NextLink href={ROUTES.login} passHref>
        <Button
          component={'a'}
          variant={'outlined'}
          sx={{
            color: theme.palette.common.white,
            backgroundColor: theme.palette.primary.main,
            border: `1px solid ${theme.palette.common.white}`,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
              border: `1px solid ${theme.palette.common.white}`,
            },
          }}
        >
          {t('login')}
        </Button>
      </NextLink>
      {showRegistrationButton && (
        <NextLink href={ROUTES.registration} passHref>
          <Button component={'a'} variant={'inverted'}>
            {t('register')}
          </Button>
        </NextLink>
      )}
    </>
  ) : showUserMenu ? (
    <UserMenu />
  ) : (
    <Button onClick={() => logout()} variant={'inverted'}>
      {t('logout')}
    </Button>
  )
}
