import { Button } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { CtaValue } from '@/cms/types'
import { getInternalOrExternalUrl } from '@/cms/utils'

export type CtaLink = CtaValue

export const CtaLink = ({
  label,
  external_link,
  internal_page,
}: CtaLink): React.ReactElement => {
  const { locale } = useRouter()

  const { url: href, isExternal } = getInternalOrExternalUrl(
    external_link,
    internal_page
  )

  if (!href) {
    return <span>{label}</span>
  }

  return isExternal ? (
    <Button
      variant={'contained'}
      component={'a'}
      href={href}
      target={'_blank'}
      rel={'noopener noreferrer nofollow'}
    >
      {label}
    </Button>
  ) : (
    <Link href={href} locale={locale} passHref>
      <Button variant={'contained'} component={'a'} href={href}>
        {label}
      </Button>
    </Link>
  )
}
