import { Box, Typography } from '@mui/material'

import { RichText } from '@/cms/components/RichText'
import { BaseBlock } from '@/cms/components/StreamBlocks/BaseBlock'
import { CtaLink } from '@/cms/components/StreamBlocks/CtaLink'
import { BaseTextBlockValue, TextBlockData } from '@/cms/types'
import { defaultSectionSx } from '@/theme/layout'

export type TextStreamBlock = TextBlockData['value']

const gridColumnMap = {
  left: { xs: '1 / -1', sm: '1 / -3', md: '1 / -4', lg: '1 / -5' },
  center: { xs: '1 / -1', sm: '2 / -2', md: '3 / -3' },
}

export const HeadingWithTextAndCta = (
  props: BaseTextBlockValue
): React.ReactElement => {
  const centered = props.orientation === 'center'
  const textAlign = centered ? 'center' : 'left'
  const justifyContent = centered ? 'center' : 'flex-start'

  return (
    <>
      <Typography component={'h2'} variant={'h1'} sx={{ textAlign, mb: 6 }}>
        {props.heading}
      </Typography>
      <RichText html={props.body} centered={centered} />
      {props.cta && (
        <Box mt={10} sx={{ justifyContent, display: 'flex' }}>
          <CtaLink {...props.cta} />
        </Box>
      )}
    </>
  )
}

export const BaseTextBlock = (
  props: BaseTextBlockValue
): React.ReactElement => {
  const gridColumn = gridColumnMap[props.orientation]

  return (
    <Box sx={defaultSectionSx}>
      <Box gridColumn={gridColumn}>
        <HeadingWithTextAndCta {...props} />
      </Box>
    </Box>
  )
}

export const TextStreamBlock = ({
  background,
  ...props
}: TextStreamBlock): React.ReactElement => {
  return (
    <BaseBlock background={background}>
      <BaseTextBlock {...props} />
    </BaseBlock>
  )
}
