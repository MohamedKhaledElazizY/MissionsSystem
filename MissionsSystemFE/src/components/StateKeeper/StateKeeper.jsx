import React, { useContext } from 'react';
import { userContext } from '../../reducers/UserProvider';
import { API_BASE_URL } from '../../data';
import axios from 'axios';

export const axiosInstance = axios.create({});

const StateKeeper = ({ children }) => {
    const { state, dispatch } = useContext(userContext);

    axiosInstance.defaults.baseURL = API_BASE_URL;
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${JSON.parse(localStorage.getItem('state'))?.token}`;
    axiosInstance.defaults.headers.common.ID = JSON.parse(localStorage.getItem('state'))?.user?.id;
    axiosInstance.defaults.headers.common.hashid = JSON.parse(localStorage.getItem('state'))?.id;

    document.addEventListener('beforeunload', (event) => {
        localStorage.setItem('state', JSON.stringify(state));
    });

    document.addEventListener('load', (event) => {
        if (localStorage.getItem('state')) {
            dispatch({
                type: 'SET_STATE',
                payload: JSON.parse(localStorage.getItem('state'))
            });
        }
    });

    return <>{children}</>;
};

export default StateKeeper;
