import { useTranslation } from 'next-i18next'

import config from '@/config/config'
import { joinUrl } from '@/utils/url.utils'

export interface DefaultPageHead {
  subPageTitle: string
  description?: string
  relativePath: string
}

export const DefaultPageHead = ({
  subPageTitle,
  description,
  relativePath,
}: DefaultPageHead): React.ReactElement => {
  const { t } = useTranslation()
  const title = `${subPageTitle} | ${t('eprTool')}`
  return (
    <>
      <title>{title}</title>
      <meta name={'description'} content={description || title} />
      <link
        rel={'canonical'}
        href={joinUrl(config.FRONTEND_URL, relativePath)}
      />
    </>
  )
}
