import type { NextPage } from 'next'
import Head from 'next/head'

import { Homepage } from '@/homepage/components/Homepage'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>EPR Registration Tool Home page</title>
        <meta name="description" content={'EPR Registration Tool Home page'} />
        <link rel={'canonical'} href={'/'} />
      </Head>
      <Homepage />
    </>
  )
}

// export const getStaticProps: GetStaticProps = async () => {
//   const apolloClient = createApolloClientSsr()
//   await apolloClient.query({
//     query: HELLO_WORLD,
//   })
//   return addApolloState(apolloClient, { props: {} })
// }

// export const getServerSideProps: GetServerSideProps = async () => {
//   const apolloClient = createApolloClientSsr()
//   await apolloClient.query({
//     query: HELLO_WORLD,
//   })
//   return addApolloState(apolloClient, { props: {} })
// }

export default Home
