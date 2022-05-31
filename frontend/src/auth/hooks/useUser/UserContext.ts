import React, { createContext } from 'react'

import { UserType } from '@/api/__types__'

import { ErrorPromise } from './utils'

export interface UserContextValue {
  user: UserType | null
}

export interface AuthContextValue {
  loading: boolean
  login: (
    userIdentifier: string,
    password: string,
    rememberMe: boolean
  ) => Promise<unknown>
  loggedIn: boolean
  setLoggedIn: (loggedIn: boolean) => Promise<unknown>
  logout: () => Promise<unknown>
}

export const AuthContext = React.createContext<AuthContextValue>({
  loading: false,
  login: ErrorPromise,
  loggedIn: false,
  setLoggedIn: ErrorPromise,
  logout: ErrorPromise,
})

export const UserContext = createContext<UserContextValue>({
  user: null,
})
