import type { GetStaticProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'

const Complete: NextPage = () => {
  return (
    <>
      <Head>
        <title>{'Complete company data | EPR Registration Tool'}</title>
        <meta
          name={'description'}
          content={'Complete company data | EPR Registration Tool'}
        />
        <link rel={'canonical'} href={'/dashboard'} />
      </Head>
      <p>{'Home of the Company Complete Form'}</p>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common'])),
      // Will be passed to the page component as props
    },
  }
}

export default Complete
