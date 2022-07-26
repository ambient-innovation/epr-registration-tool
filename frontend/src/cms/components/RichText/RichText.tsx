import { Link, Typography, Box, BoxProps } from '@mui/material'
import parse, {
  Element,
  domToReact,
  HTMLReactParserOptions,
} from 'html-react-parser'
import DOMPurify from 'isomorphic-dompurify'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import {
  centeredSx,
  richTextCss,
} from 'src/cms/components/RichText/RichText.styles'

import { getInternalOrExternalUrl } from '@/cms/utils'
import { SxStyleObject } from '@/theme/utils'

export interface RichText extends Omit<BoxProps, 'children' | 'sx'> {
  html: string
  sx?: SxStyleObject
  centered?: boolean
}

/**
 * If this function does not return anything,
 * the node will not be replaced
 * */
const getOptions = (locale: string | undefined): HTMLReactParserOptions => {
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.attribs) {
        const attribs = domNode.attribs
        const tagName = domNode.tagName
        const children = domNode.children
        if (tagName === 'a') {
          const {
            href,
            'data-slug': slug,
            'data-pagetype': pageType,
            ...rest
          } = attribs

          const page = (slug && pageType && { slug, type: pageType }) || null

          const { url, isExternal } = getInternalOrExternalUrl(href, page)

          const childNodes = domToReact(children, options)

          if (!url) {
            return <span>{childNodes}</span>
          } else if (isExternal) {
            return (
              <Link
                href={url}
                {...rest}
                target={'_blank'}
                rel={'noopener noreferrer nofollow'}
              >
                {childNodes}
              </Link>
            )
          } else {
            return (
              <NextLink href={url} locale={locale} passHref>
                <Link {...rest}>{childNodes}</Link>
              </NextLink>
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
  return options
}

export const RichText = React.forwardRef<HTMLDivElement, RichText>(
  ({ html, sx, centered = false, ...props }, ref): React.ReactElement => {
    const { locale } = useRouter()

    // ADD_ATTR to allow target att in anchor tags
    const children: React.ReactNode = useMemo(() => {
      const cleanHtml = DOMPurify.sanitize(html, { ADD_ATTR: ['target'] })
      return parse(cleanHtml, getOptions(locale))
    }, [html, locale])

    return (
      <Box
        ref={ref}
        sx={[richTextCss, !!sx && sx, centered && centeredSx]}
        {...props}
      >
        {children}
      </Box>
    )
  }
)
