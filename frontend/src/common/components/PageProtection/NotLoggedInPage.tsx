import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useUser } from 'src/auth/hooks/useUser'

import { ROUTES } from '@/routes'

export interface NotLoggedInPage {
  children: React.ReactNode
}

/**
 * Pages which are only accessible if user is NOT logged in
 * */
export const NotLoggedInPage = ({
  children,
}: NotLoggedInPage): React.ReactElement => {
  const router = useRouter()
  const { loading, loggedIn } = useUser()

  const userStateIsLoadedAndLoggedIn = !loading && loggedIn

  useEffect(() => {
    if (userStateIsLoadedAndLoggedIn) {
      const {
        // take "next" query parameter to redirect user to the requested
        // resource after requiring a login
        next,
        // alert is only need on logout
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        alert: _,
        // keep all other query parameters
        ...query
      } = router.query

      const pathname =
        typeof next === 'string' && next.startsWith('/')
          ? next
          : // default redirect after login
            ROUTES.dashboard

      router.push({ pathname, query })
    }
  }, [userStateIsLoadedAndLoggedIn, router])

  return <>{children}</>
}
