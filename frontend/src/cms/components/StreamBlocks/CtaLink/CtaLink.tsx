import { Button } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { CtaValue } from '@/cms/types'
import { getInternalOrExternalUrl } from '@/cms/utils'
import { SxStyleObject } from '@/theme/utils'

export type CtaLink = CtaValue

const buttonSx: SxStyleObject = { width: { xs: '100%', sm: 'auto' } }

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
      sx={buttonSx}
    >
      {label}
    </Button>
  ) : (
    <Link href={href} locale={locale} passHref>
      <Button variant={'contained'} component={'a'} href={href} sx={buttonSx}>
        {label}
      </Button>
    </Link>
  )
}
