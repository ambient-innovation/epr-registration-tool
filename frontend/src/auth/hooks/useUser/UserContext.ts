import React, { createContext } from 'react'

import { UserType } from '@/api/__types__'

import { ErrorPromise } from './utils'

export type UserMeType = Pick<
  UserType,
  'id' | 'email' | 'title' | 'fullName' | 'languagePreference'
>

export interface UserContextValue {
  user: UserMeType | null
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
  activate: (ident: string, token: string) => Promise<unknown>
  requestPasswordReset: (email: string) => Promise<unknown>
  resetPassword: (
    ident: string,
    token: string,
    password: string
  ) => Promise<unknown>
}

export const AuthContext = React.createContext<AuthContextValue>({
  loading: false,
  login: ErrorPromise,
  loggedIn: false,
  setLoggedIn: ErrorPromise,
  logout: ErrorPromise,
  activate: ErrorPromise,
  requestPasswordReset: ErrorPromise,
  resetPassword: ErrorPromise,
})

export const UserContext = createContext<UserContextValue>({
  user: null,
})
