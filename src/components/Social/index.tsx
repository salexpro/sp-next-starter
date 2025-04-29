import React from 'react'
import { Button } from 'react-bootstrap'
import cn from 'classnames'

import { SOCIALS, ICONS, LABELS, LINKS, type LinksType } from './constants'

import s from './Social.module.scss'

const Social = ({
  data = SOCIALS,
  variant = '',
  short,
  labels,
  buttons,
  className,
}: {
  data?: typeof SOCIALS
  variant?: string
  short?: boolean
  labels?: boolean
  buttons?: boolean | string
  className?: string
}) => {
  const isButtons = variant === 'buttons' || buttons

  if (short) data = data.slice(0, -1)

  return (
    <ul
      className={cn(
        s.social,
        {
          [s[`social--${variant}`]]: variant,
        },
        className
      )}
    >
      {data.map(({ key, label, link }) => (
        <li key={key} className={s.social__item}>
          {React.createElement(
            // @ts-ignore
            isButtons ? Button : 'a',
            {
              as: isButtons ? 'a' : undefined,
              href: link || LINKS[key as keyof LinksType],
              target: '_blank',
              className: cn({
                [s.social__link]: !isButtons,
                // [s.zoom]: !isButtons && variant !== 'card',
              }),
              'aria-label': label,
              rel: 'noreferrer',
              variant: typeof buttons === 'string' ? buttons : 'light',
            },
            <>
              <span className="icon">{ICONS[key]}</span>
              {(labels || isButtons) && `${label || LABELS[key]} `}
            </>
          )}
        </li>
      ))}
    </ul>
  )
}

export default Social
