import type { NextPage } from 'next'
import Head from 'next/head'

import { Homepage } from '@/homepage/components/Homepage'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>EPR Registration Tool Home page</title>
        <meta name="description" content={'home page'} />
        <link rel={'canonical'} href={''} />
      </Head>
      <Homepage />
    </>
  )
}
export default Home
