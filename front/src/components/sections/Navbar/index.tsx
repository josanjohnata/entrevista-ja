import React, { useState } from 'react';
import { Logo } from '../../Logo';
import { FiMenu, FiX } from 'react-icons/fi';
import { Header, NavContainer, DesktopNav, NavLink, MobileMenuButton, MobileSheet, LoginButton } from './styles';
import type { NavItem } from '../../../types/index';
import { Link } from 'react-router-dom';

const navLinks: NavItem[] = [
  { href: '#funcionamento', label: 'Funcionamento' },
  { href: '#preco', label: 'Preço' },
];

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Header>
      <NavContainer>
        <Logo />

        <DesktopNav>
          {navLinks.map((link) => (
            <NavLink key={link.label} href={link.href}>{link.label}</NavLink>
          ))}
          <LoginButton as={Link} to="/login">Login</LoginButton>
        </DesktopNav>

        <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)}>
          <FiMenu size={24} />
        </MobileMenuButton>
      </NavContainer>

      <MobileSheet $isOpen={isMobileMenuOpen}>
        <MobileMenuButton onClick={() => setIsMobileMenuOpen(false)} style={{ alignSelf: 'flex-end' }}>
          <FiX size={24} />
        </MobileMenuButton>
        <Logo />
        {navLinks.map((link) => (
          <NavLink key={link.label} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
            {link.label}
          </NavLink>
        ))}
        <LoginButton as={Link} to="/login">Login</LoginButton>
      </MobileSheet>
    </Header>
  );
};