import axios from 'axios';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
} from './types';
import { setAlert } from './alert';
import setAuthToken from '../utils/setAuthToken';

// load user
export const loadUser = () => async (dispatch) => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }
    try {
        const res = await axios.get('/api/auth');
        dispatch({
            type: USER_LOADED,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: AUTH_ERROR,
        });
    }
};

// resister user
export const register =
    ({ name, email, password }) =>
        async (dispatch) => {
            const newUser = { name, email, password };
            try {
                const res = await axios.post('/api/users', newUser);
                dispatch({
                    type: REGISTER_SUCCESS,
                    payload: res.data,
                });
                dispatch(loadUser());
            } catch (err) {
                const errors = err.response.data.errors;
                if (errors) {
                    errors.forEach((error) =>
                        dispatch(setAlert(error.msg, 'danger')),
                    );
                }
                dispatch({
                    type: REGISTER_FAIL,
                });
            }
        };

// login user
export const login = (email, password) => async (dispatch) => {
    const user = { email, password };
    try {
        const res = await axios.post('/api/auth', user);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data,
        });
        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: LOGIN_FAIL,
        });
    }
};

export const logout = () => async (dispatch) => {
    dispatch({ type: LOGOUT });
};
