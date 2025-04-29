import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import og_image from './opengraph-image.png'
import next_logo from '~img/next-logo.svg?url'
import NextIcon from '~icons/next.svg'

const Home = () => {
  return (
    <div className="container">
      <h1>Greetings Mark S!</h1>
      <p>Welcome to your new Nextjs site.</p>
      <p>Now go refine something great.</p>
      {/* Example of Next Image */}
      <p>
        <Image src={og_image} width="650" alt="Image" placeholder="blur" />
      </p>
      <p>
        <Image src={next_logo} alt="Nextjs Logo" />
      </p>
      <p>
        {/* Example of Icons usage  */}
        <NextIcon width={60} /* height={60} */ />
      </p>
      <p>
        <Link href="/page-2">Go to page 2</Link> <br />
      </p>
    </div>
  )
}

export default Home
