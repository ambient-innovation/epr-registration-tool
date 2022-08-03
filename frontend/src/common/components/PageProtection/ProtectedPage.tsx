import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useUser } from 'src/auth/hooks/useUser'

import { ROUTES } from '@/routes'

export interface ProtectedPage {
  children: React.ReactNode
}

/**
 * Protected pages which are only accessible if user is logged in
 * */
export const ProtectedPage = ({
  children,
}: ProtectedPage): React.ReactElement => {
  const router = useRouter()
  const { loading, loggedIn } = useUser()

  const userStateIsLoadedAndNotLoggedIn = !loading && !loggedIn

  useEffect(() => {
    if (userStateIsLoadedAndNotLoggedIn) {
      router.push({
        pathname: ROUTES.login,
        query: { ...router.query, next: router.pathname },
      })
    }
  }, [userStateIsLoadedAndNotLoggedIn, router])

  return <>{children}</>
}
