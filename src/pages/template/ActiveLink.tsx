/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import styled from 'styled-components';
import theme from '../../theme';

const Link = styled(NavLink)<NavLinkProps>`
    margin-bottom: ${({ theme }) => theme.spacing.m};
    background-color: ${({ theme }) => theme.colors.SemiDarkGray};
    border-radius: 0.25rem;
    padding: ${({ theme }) => theme.spacing.xxs};
    white-space: nowrap;
    font-weight: bold;
    font-size: ${({ theme }) => theme.fontSize.m};

    @media (max-width: ${({ theme }) => theme.media.smallTablet}) {
        font-size: ${({ theme }) => theme.fontSize.l};
    }

    &:hover {
        background-color: ${({ theme }) => theme.colors.White};
    }
`;

export const ActiveLink: React.FC<NavLinkProps> = ({ children, ...rest }) => {
    return (
        <Link end style={({ isActive }) => (isActive ? { color: theme.colors.primary } : undefined)} {...rest}>
            {children}
        </Link>
    );
};
