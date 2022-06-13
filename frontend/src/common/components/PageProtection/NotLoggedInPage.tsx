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
  const { loading, user } = useUser()

  useEffect(() => {
    !loading && user && router.push(ROUTES.home)
  }, [user, router, loading])

  return <>{children}</>
}
