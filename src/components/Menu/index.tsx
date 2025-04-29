'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Nav, Dropdown, Offcanvas, Accordion } from 'react-bootstrap'
import cn from 'classnames'

// import ConnectButton from '~components/ConnectButton'
import Social from '../Social'
import Logo from '../Logo'

import MENU from './constants'

import MenuIcon from '~icons/menu.svg'
import ChevronIcon from '~icons/chevron.svg'
import ExternalIcon from '~icons/external.svg'

import s from './Menu.module.scss'

// gsap.registerPlugin(ScrollToPlugin)

interface LinkProps {
  name: string
  link?: string
  target?: string
  dropdown?: LinkProps[]
  list?: LinkProps[]
  onClick?: React.MouseEventHandler
  className?: string
  active?: boolean
  alt?: string
  flatten?: boolean
  variant?: string
}

interface MenuProps {
  variant?: string
  data?: LinkProps[]
  flatten?: boolean
  collapse?: boolean
  onClick?: React.MouseEventHandler
}

const NavLink = ({
  name,
  link,
  target,
  dropdown,
  list,
  onClick,
  className,
  active,
  // variant,
}: LinkProps) => {
  const pathname = usePathname()
  // const isHomepage = pathname === '/'

  // const isDropdownActive = dropdown?.some((dropItem) =>
  //   pathname.includes(dropItem.link as string)
  // )

  const dropdownActiveItem = dropdown?.findLast((dropItem) =>
    pathname.includes(dropItem.link as string)
  )

  switch (true) {
    case !!dropdown?.length:
      return (
        <Dropdown>
          <Dropdown.Toggle
            as="a"
            role="button"
            className={cn('nav-link', { active: !!dropdownActiveItem })}
          >
            {name}
            <span></span>
          </Dropdown.Toggle>
          <Dropdown.Menu
            as="ul"
            variant="header"
            style={
              {
                '--show': '0',
                '--pill': '0',
                '--subpill': '0',
              } as React.CSSProperties
            }
            renderOnMount
          >
            {dropdown.map((props) => (
              <NavItem
                {...props}
                key={props.name}
                active={props.name === dropdownActiveItem?.name}
              />
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )

    case !!list?.length:
      return (
        <>
          <Nav.Link
            as={Link}
            href={link}
            onClick={onClick}
            bsPrefix={className}
            active={active ?? pathname.includes(link as string)}
          >
            {name}
          </Nav.Link>
          <Nav className="nav--list" as="ul">
            {list.map((props) => (
              <NavItem
                {...props}
                key={props.name}
                onClick={onClick}
                // active={props.name === activeFlattenItem?.name}
              />
            ))}
          </Nav>
        </>
      )

    // case isHomepage && link?.includes('#'):
    //   return (
    //     <Nav.Link href={link} onClick={onClick}>
    //       {name}
    //     </Nav.Link>
    //   )
    case link?.includes('http') || !!target:
      return (
        <Nav.Link
          href={link}
          target={target || '_blank'}
          rel="noreferrer"
          bsPrefix={className}
          active={false}
        >
          {name}
          <ExternalIcon />
        </Nav.Link>
      )
    case !link:
      return name
    default:
      return (
        <Nav.Link
          as={Link}
          href={link}
          onClick={onClick}
          bsPrefix={className}
          active={active ?? pathname.includes(link as string)}
        >
          {name}
        </Nav.Link>
      )
  }
}

const NavItem = (props: LinkProps) => (
  <Nav.Item as="li">
    <NavLink {...props} /* onClick={handleScroll} */ />
  </Nav.Item>
)

const NavMenu = ({
  variant,
  data = MENU,
  flatten,
  collapse,
  onClick,
}: MenuProps) => {
  const pathname = usePathname()

  if (flatten) {
    // Group menu data into categories for footer display
    const flattenData = data.reduce(
      (acc, curr, i) => {
        // Get flattened items from current menu item and its dropdowns
        const flattenedItems = curr.dropdown?.length
          ? curr.dropdown.flatMap((dropdownItem) =>
              dropdownItem.list?.length
                ? [
                    {
                      name: dropdownItem.name,
                      alt: dropdownItem.alt,
                      link: dropdownItem.link,
                    },
                    ...dropdownItem.list,
                  ]
                : [dropdownItem]
            )
          : [curr]

        // Determine category name (first 3 items keep their name, others go to "Other")
        const categoryName = i > 2 ? 'Other' : curr.name

        // Add items to the appropriate category
        return {
          ...acc,
          [categoryName]: acc[categoryName]
            ? [...acc[categoryName], ...flattenedItems]
            : [{ name: categoryName }, ...flattenedItems],
        }
      },
      {} as Record<string, LinkProps[]>
    )

    return Object.entries(flattenData).map(([key, items]) => {
      const activeFlattenItem = items.findLast(({ link }) =>
        pathname.includes(link as string)
      )

      return (
        <Nav
          as="ul"
          className={cn({ [`nav--${variant}`]: !!variant })}
          style={{ gridArea: key.toLowerCase() }}
          key={key}
        >
          {items
            .map((item) => ({ ...item, name: item.alt || item.name }))
            .filter((item) => item.flatten !== false)
            .map((props) => (
              <NavItem
                {...props}
                key={props.name}
                onClick={onClick}
                active={props.name === activeFlattenItem?.name}
                variant={variant}
              />
            ))}
        </Nav>
      )
    })
  }

  if (collapse) {
    const activeAccordionItemIndex = data.findIndex(({ dropdown }) =>
      dropdown?.some(({ link }) => pathname.includes(link as string))
    )

    return (
      <Accordion
        as="ul"
        bsPrefix={s.collapse}
        defaultActiveKey={
          activeAccordionItemIndex >= 0 ? `c${activeAccordionItemIndex}` : null
        }
      >
        {data.map((props, i) => {
          const activeNavItem = props?.dropdown?.findLast(({ link }) =>
            pathname.includes(link as string)
          )

          return props?.dropdown ? (
            <Accordion.Item
              as="li"
              eventKey={`c${i}`}
              key={props.name}
              bsPrefix={s.collapse__item}
            >
              <Accordion.Button bsPrefix={s.collapse__button}>
                {props.name}
                <ChevronIcon />
              </Accordion.Button>
              <Accordion.Body as="ul" bsPrefix="nav nav--collapse">
                {props.dropdown.map((item) => (
                  <NavItem
                    {...item}
                    key={item.name}
                    onClick={onClick}
                    active={item.name === activeNavItem?.name}
                  />
                ))}
              </Accordion.Body>
            </Accordion.Item>
          ) : (
            <Nav.Item as="li" key={props.name} bsPrefix={s.collapse__item}>
              <NavLink
                className={s.collapse__button}
                onClick={onClick}
                {...props}
              />
            </Nav.Item>
          )
        })}
      </Accordion>
    )
  }

  return (
    <Nav className={cn({ [`nav--${variant}`]: !!variant })} as="ul">
      {data.map((props) => (
        <NavItem {...props} key={props.name} onClick={onClick} />
      ))}
    </Nav>
  )
}

const Menu = (props: MenuProps) => {
  const [menu, setMenu] = useState(false)

  const handleMenu = () => {
    setMenu((prev) => !prev)
  }

  useEffect(() => {
    if (props?.variant !== 'header') return

    const dropdowns = document.querySelectorAll('.dropdown-menu-header')
    if (!dropdowns.length) return

    dropdowns.forEach((menu) => {
      const menuElement = menu as HTMLElement

      // Show/hide dropdown animations
      menuElement.addEventListener('mouseenter', () =>
        menuElement.style.setProperty('--show', '1')
      )
      menuElement.addEventListener('mouseleave', () =>
        menuElement.style.setProperty('--show', '0')
      )

      // Handle main navigation pill highlight
      const anchors = Array.from(menuElement.children)
        .map((el) => el.querySelector('.nav-link'))
        .filter(Boolean)

      menuElement.addEventListener('mousemove', (e) => {
        const target = e.target as HTMLElement
        if (target.tagName === 'A') {
          const position = anchors.indexOf(target)
          if (position !== -1) {
            menuElement.style.setProperty('--pill', position.toString())
          }
        }
      })

      // Handle sublist pill highlights if present
      const sublist = menuElement.querySelector('.nav--list')
      if (sublist) {
        const subAnchors = sublist.querySelectorAll('.nav-link')
        menuElement.style.setProperty('--sublist', subAnchors.length.toString())

        sublist.addEventListener('mousemove', (e) => {
          const target = e.target as HTMLElement
          if (target.tagName === 'A') {
            const position = Array.from(subAnchors).indexOf(target)
            if (position !== -1) {
              menuElement.style.setProperty('--subpill', position.toString())
            }
          }
        })
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  switch (props?.variant) {
    case 'offcanvas':
      return (
        <>
          <button
            className={cn(s.hamb, { [s.open]: menu })}
            aria-label="Open menu"
            onClick={handleMenu}
          >
            <MenuIcon />
          </button>
          <Offcanvas show={menu} onHide={handleMenu} placement="end">
            <div className="offcanvas-inner">
              <Offcanvas.Header closeButton>
                <Logo className="offcanvas-logo" onClick={handleMenu} />
              </Offcanvas.Header>
              <Offcanvas.Body>
                <NavMenu {...props} onClick={handleMenu} collapse />
              </Offcanvas.Body>
              <div className="offcanvas-footer">
                <Social variant="offcanvas" />
                {/* <ConnectButton /> */}
              </div>
            </div>
          </Offcanvas>
        </>
      )
    case 'footer':
      return <NavMenu {...props} flatten />
    default:
      return <NavMenu {...props} />
  }
}

export default Menu
