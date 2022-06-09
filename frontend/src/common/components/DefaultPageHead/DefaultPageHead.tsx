import { useTranslation } from 'next-i18next'

export interface DefaultPageHead {
  subPageTitle: string
}

export const DefaultPageHead = ({
  subPageTitle,
}: DefaultPageHead): React.ReactElement => {
  const { t } = useTranslation()
  const title = `${subPageTitle} | ${t('eprTool')}`
  return (
    <>
      <title>{title}</title>
      <meta name={'description'} content={title} />
      <link rel={'canonical'} href={'/'} />
    </>
  )
}
