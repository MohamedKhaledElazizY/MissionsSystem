import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { userContext } from '../../reducers/UserProvider';

export default function AuthRoute() {
    const { state } = useContext(userContext);
    return <>{!state.isLoggedIn ? <Outlet /> : <Navigate to="/" />}</>;
}
