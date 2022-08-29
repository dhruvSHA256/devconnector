import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT,
    ACCOUNT_DELETED,
} from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
};

function authReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload,
            };
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            localStorage.setItem('token', payload.token);
            return {
                ...state,
                ...payload,
                loading: false,
                isAuthenticated: true,
            };
        case REGISTER_FAIL:
        case LOGIN_FAIL:
        case AUTH_ERROR:
        case ACCOUNT_DELETED:
        case LOGOUT:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                loading: true,
                isAuthenticated: false,
            };
        default:
            return state;
    }
}

export default authReducer;
