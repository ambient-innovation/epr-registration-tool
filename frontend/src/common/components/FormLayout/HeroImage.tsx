import Image from 'next/image'
import React from 'react'

import { imageCss } from './HeroImage.styles'

export type HeroImage = Record<string, never>

export const HeroImage = (_: HeroImage): React.ReactElement => {
  return (
    <Image
      src={'/assets/hero-image.png'}
      css={imageCss}
      layout={'fill'}
      objectFit={'cover'}
      objectPosition={'center center'}
      quality={90}
      aria-hidden
      alt={'Jordan Amman city'}
      // image is marked as LCP
      // https://nextjs.org/docs/api-reference/next/image#priority
      priority
    />
  )
}
