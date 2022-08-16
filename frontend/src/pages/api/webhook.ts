import { NextApiRequest, NextApiResponse } from 'next'

import { fetchMenuPagesForRevalidate } from '@/cms/api'
import config from '@/config/config'

const { PUBLISH_SECRET } = config
/**
 * On-demand Revalidation webhook, to manually purge the Next.js cache for a specific page.
 * This makes it easier to update the site cms pages, when
 * the content of the headless CMS is created or updated.
 * **/
export default async function handleWebhook(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['GET', 'PUT'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
  const { secret, slug, showInMenus } = req.body

  if (!PUBLISH_SECRET) {
    return res.status(500).json({ message: 'Publish secret not configured' })
  }
  if (secret !== PUBLISH_SECRET) {
    return res.status(401).json({ message: 'Invalid secret' })
  }
  try {
    console.info('[Next.js] Revalidating /')
    await res.revalidate('/')
    console.info('[Next.js] Revalidating /ar')
    await res.revalidate('/ar')

    if (showInMenus) {
      console.info(`[Next.js] Revalidating Menu pages`)

      const pages = await fetchMenuPagesForRevalidate()

      for await (const page of pages) {
        await res.revalidate(`/${page.meta.slug}`)
        await res.revalidate(`/ar/${page.meta.slug}`)
      }
    } else if (!!slug && slug !== 'home') {
      console.info(`[Next.js] Revalidating /${slug}`)
      await res.revalidate(`/${slug}`)
      console.info(`[Next.js] Revalidating /ar/${slug}`)
      await res.revalidate(`/ar/${slug}`)
    }
    return res.status(200).json({ revalidated: true })
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating')
  }
}
