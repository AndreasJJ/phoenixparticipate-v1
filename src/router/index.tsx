/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

// Local dependencies
import { AuthRoute } from './AuthRoute';
import { useAuth } from '../authentication/useAuth';
// Pages / routes
import { Login } from '../pages/login';
import { Loading } from '../pages/loading';
import { Tickets } from '../pages/tickets/view';
import { Template } from '../pages/template';
import { Error404 } from '../pages/errors/Error404';
import { Crew } from '../pages/crew';
import { Avatar } from '../pages/avatar';
import { MyCrew } from '../pages/myCrews';
import { TicketPurchase } from '../pages/tickets/purchase';
import { TicketSeating } from '../pages/tickets/seat';
import { MembershipStatus } from '../pages/membership';

export const Router: React.FC = () => {
    const { initialized } = useAuth();

    if (!initialized) {
        return <Loading />;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AuthRoute isPublic redirectTo="/" />}>
                    <Route path="/login" element={<Login />} />
                </Route>
                <Route element={<AuthRoute redirectTo="/login" />}>
                    <Route element={<Template />}>
                        <Route index element={<Tickets />} />
                        <Route path="/crew" element={<Crew />} />
                        <Route path="/seating" element={<TicketSeating />} />
                        <Route path="/membership" element={<MembershipStatus />} />
                        <Route path="/buy" element={<TicketPurchase />} />
                        <Route path="/avatar" element={<Avatar />} />
                        <Route path="/my-crew" element={<MyCrew />} />
                        <Route path="/" element={<Crew />} />
                    </Route>
                </Route>
                <Route path="*" element={<Error404 />} />
            </Routes>
        </BrowserRouter>
    );
};
