import React from 'react';
import styled from 'styled-components';
import { FiKey, FiUsers, FiSearch } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';

const Nav = styled.nav`
  background: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.sm};
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xl};
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.primary};
  }
`;

const Navigation = () => {
  const location = useLocation();

  return (
    <Nav>
      <NavContent>
        <StyledLink to="/" $active={location.pathname === '/'}>
          <FiKey /> Key Maker
        </StyledLink>
        <StyledLink to="/analyse" $active={location.pathname === '/analyse'}>
          <FiSearch /> Key Analyser
        </StyledLink>
        <StyledLink to="/invite" $active={location.pathname === '/invite'}>
          <FiUsers /> Invite & Track
        </StyledLink>
      </NavContent>
    </Nav>
  );
};

export default Navigation; 