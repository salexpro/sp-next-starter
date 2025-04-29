'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import cn from 'classnames'

import logo from '~img/next-logo.svg?url'

import s from './Logo.module.scss'

const image = <Image src={logo} alt="Next" priority />

const Logo = ({
  className,
  onClick,
}: {
  className?: string
  onClick?: () => void
}) => {
  const pathname = usePathname()
  const isHomepage = pathname === '/'

  return isHomepage ? (
    <div className={cn(s.logo, className)}>{image}</div>
  ) : (
    <Link href="/" className={cn(s.logo, className)} onClick={onClick}>
      {image}
    </Link>
  )
}

export default Logo
