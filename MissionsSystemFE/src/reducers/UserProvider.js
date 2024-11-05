import React, { useReducer, useEffect, createContext } from 'react';

const initialState = {
    isLoggedIn: false,
    isAdmin: false,
    user: null,
    token: null,
    id: null,
    auths: null
};

export const userContext = createContext(initialState);

export const userReducer = (state, action) => {
    switch (action.type) {
        case 'ADMIN_LOGIN':
            localStorage.setItem(
                'state',
                JSON.stringify({
                    isLoggedIn: true,
                    isAdmin: true,
                    user: action.payload.user
                })
            );
            return {
                isLoggedIn: true,
                isAdmin: true,
                user: action.payload.user
            };
        case 'LOGIN':
            localStorage.setItem(
                'state',
                JSON.stringify({
                    isLoggedIn: true,
                    isAdmin: false,
                    user: action.payload.user,
                    token: action.payload.token,
                    id: action.payload.id,
                    auths: action.payload.auths
                })
            );
            return {
                isLoggedIn: true,
                isAdmin: false,
                user: action.payload.user,
                token: action.payload.token,
                id: action.payload.id,
                auths: action.payload.auths
            };
        case 'LOGOUT':
            localStorage.removeItem('state');
            return {
                isLoggedIn: false,
                isAdmin: false,
                user: null,
                token: null,
                id: null,
                auths: null
            };
        case 'SET_STATE':
            return action.payload;
        default:
            throw new Error('No type matched');
    }
};

const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, initialState);

    useEffect(() => {
        if (localStorage.getItem('state')) {
            dispatch({
                type: 'SET_STATE',
                payload: JSON.parse(localStorage.getItem('state'))
            });
        }
        return () => {
            localStorage.setItem('state', JSON.stringify(state));
        };
    }, []);

    return <userContext.Provider value={{ state, dispatch }}>{children}</userContext.Provider>;
};

export default UserProvider;
