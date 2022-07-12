import { Link, Typography, Box, BoxProps } from '@mui/material'
import parse, {
  Element,
  domToReact,
  HTMLReactParserOptions,
} from 'html-react-parser'
import DOMPurify from 'isomorphic-dompurify'
import NextLink from 'next/link'
import React, { useMemo } from 'react'

import { richTextCss } from './RichText.styles'

export interface RichText extends Omit<BoxProps, 'children'> {
  html: string
}

/**
 * If this function does not return anything,
 * the node will not be replaced
 * */
const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element && domNode.attribs) {
      const attribs = domNode.attribs
      const tagName = domNode.tagName
      const children = domNode.children
      if (tagName === 'a') {
        const { href, ...rest } = attribs
        if (href && href.startsWith('/')) {
          return (
            <NextLink href={href} passHref>
              <Link {...rest}>{domToReact(children, options)}</Link>
            </NextLink>
          )
        } else {
          return (
            <Link href={href} {...rest} target={'_blank'}>
              {domToReact(children, options)}
            </Link>
          )
        }
      } else if (tagName === 'h2' || tagName === 'h3') {
        return (
          <Typography variant={tagName} component={tagName}>
            {domToReact(children, options)}
          </Typography>
        )
      } else if (tagName === 'p') {
        return <Typography>{domToReact(children, options)}</Typography>
      }
    }
  },
}

export const RichText = React.forwardRef<HTMLDivElement, RichText>(
  ({ html, ...props }, ref): React.ReactElement => {
    // ADD_ATTR to allow target att in anchor tags
    const children: React.ReactNode = useMemo(() => {
      const cleanHtml = DOMPurify.sanitize(html, { ADD_ATTR: ['target'] })
      return parse(cleanHtml, options)
    }, [html])
    return (
      <Box ref={ref} sx={richTextCss} {...props}>
        {children}
      </Box>
    )
  }
)
