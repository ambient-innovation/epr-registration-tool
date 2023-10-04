/**
 * Redundant to `/next-18next.config.js`
 * --> could not find a way to use one definition for both:
 *   - next.js config
 *   - typescript code base
 * */

export const DEFAULT_LOCALE = 'en'
export const LOCALES = ['en', 'ar'] as const

export type LocaleType = (typeof LOCALES)[number]
