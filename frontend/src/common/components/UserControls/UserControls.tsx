import { Button } from '@mui/material'
import { useTranslation } from 'next-i18next'
import NextLink from 'next/link'

import { useUser } from '@/auth/hooks/useUser'
import { ROUTES } from '@/routes'
import { theme } from '@/theme'

import { UserMenu } from './UserMenu'

export const UserControls = () => {
  const { t } = useTranslation()
  const { loggedIn, loading } = useUser()

  if (loading) {
    return null
  }

  return !loggedIn ? (
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
  )
}
