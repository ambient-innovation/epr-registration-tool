import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { useRouter } from 'next/router'
import { prefixer } from 'stylis'
import rtlPlugin from 'stylis-plugin-rtl'

const options = {
  rtl: { key: 'css-rtl', prepend: true, stylisPlugins: [prefixer, rtlPlugin] },
  ltr: { key: 'css-ltr', prepend: true },
}

export interface RtlProvider {
  children: React.ReactNode
}

export const createEmotionCache = (dir: 'rtl' | 'ltr' = 'ltr') =>
  createCache(options[dir])

export const EmotionCacheProvider = ({ children }: RtlProvider) => {
  const { locale } = useRouter()
  const dir = locale == 'ar' ? 'rtl' : 'ltr'
  const cache = createEmotionCache(dir)
  return <CacheProvider value={cache}>{children}</CacheProvider>
}
