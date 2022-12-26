import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../authentication/useAuth';
import { Outlet } from 'react-router-dom';

interface Props {
    redirectTo: string;
    isPublic?: boolean;
}

export const AuthRoute: React.FC<Props> = ({ children, redirectTo, isPublic = false }) => {
    const { authenticated } = useAuth();

    const publicRoute = () => {
        return authenticated ? <Navigate to={redirectTo} /> : <Outlet />;
    };

    const privateRoute = () => {
        return authenticated ? <Outlet /> : <Navigate to={redirectTo} />;
    };

    return <>{isPublic ? publicRoute() : privateRoute()}</>;
};
