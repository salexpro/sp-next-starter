import React from 'react'
import type { Metadata, Viewport } from 'next'

// Analytics
// import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/react'
// import Script from 'next/script'

import Header from '~components/Header'
import Footer from '~components/Footer'

import '../styles/app.scss'

// Example of using google font
// For local fonts follow: https://nextjs.org/docs/basic-features/font-optimization#local-fonts

import { Figtree } from 'next/font/google'

const figtree = Figtree({
  subsets: ['latin'],
  display: 'swap',
  variable: '--bs-body-font-family',
})

const title = "SP's Next Starter"

export const metadata: Metadata = {
  // metadataBase: new URL('https://salex.pro'),
  title: {
    template: `%s | ${title}`,
    default: title,
  },
  description:
    'LightLink is an Ethereum Layer 2 that simplifies blockchain interactions, making it easy to focus on building, growing, and discovering what’s next',
  keywords:
    'cryptocurrency, web3, Blockchain, smart contracts, decentralized solutions, blockchain consultancy, pellar',
  openGraph: {
    locale: 'en-US',
    type: 'website',
    images: [`/api/og?t=Discover Possible with Effortless Blockchain`],
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export const viewport: Viewport = {
  themeColor: 'black',
  initialScale: 1,
  maximumScale: 1,
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={figtree.variable} style={{ minWidth: 360 }}>
        <Header />
        <main className="main">{children}</main>
        <Footer />
      </body>
      {/* <GoogleAnalytics gaId="G-9WVN0BSZSB" /> */}
      <Analytics />
      {/* Custom analytics */}
      {/* {(process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ||
        process.env.NODE_ENV === 'development') && (
        <Script id="analytic-id"></Script>
      )} */}
    </html>
  )
}

export default RootLayout
