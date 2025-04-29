import React from 'react'

import X from '~icons/social/x.svg'
import Discord from '~icons/social/discord.svg'
import Telegram from '~icons/social/telegram.svg'
import LinkedIn from '~icons/social/linkedin.svg'
import Web from '~icons/social/web.svg'

const KEYS = ['discord', 'x', 'linkedin', 'telegram'] as const

type ExtendedKeys = (typeof KEYS)[number] | 'web'

export const ICONS: Record<ExtendedKeys, React.ReactNode> = {
  x: <X />,
  discord: <Discord />,
  telegram: <Telegram />,
  linkedin: <LinkedIn />,
  web: <Web />,
}

export const LABELS: Record<ExtendedKeys | 'web', string> = {
  x: 'Twitter',
  discord: 'Discord',
  telegram: 'Telegram',
  linkedin: 'LinkedIn',
  web: 'Website',
}

export type LinksType = { [key in (typeof KEYS)[number]]: `https://${string}` }

export const LINKS: LinksType = {
  x: 'https://twitter.com/salexpro',
  discord: 'https://discord.com/invite/#',
  telegram: 'https://t.me/salexpro',
  linkedin: 'https://www.linkedin.com/in/salexpro/',
}

export type SocialType = {
  key: ExtendedKeys
  label?: string
  link?: `https://${string}`
}

export const SOCIALS: SocialType[] = KEYS.map((key) => ({
  key,
  label: LABELS[key],
  link: LINKS[key],
}))

export default SOCIALS
