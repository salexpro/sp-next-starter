import React from 'react'
import { Container } from 'react-bootstrap'

import Menu from '../Menu'

import s from './Header.module.scss'

interface HeaderProps {
  title?: string
}

const Header = ({ title }: HeaderProps) => (
  <Container as="header" className={s.header}>
    <div className={s.header__logo}>{title}</div>
    <Menu />
  </Container>
)

export default Header
