import axiosApp from "../../axiosApp";
import {push} from 'connected-react-router';

export const REGISTER_USER_REQUEST = 'REGISTER_USER_REQUEST';
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
export const REGISTER_USER_FAILURE = 'REGISTER_USER_FAILURE';

export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE';

export const LOGOUT_USER_SUCCESS = 'LOGOUT_USER_SUCCESS';

export const registerUserRequest = () => ({type: REGISTER_USER_REQUEST});
export const registerUserSuccess = () => ({type: REGISTER_USER_SUCCESS});
export const registerUserFailure = error => ({type: REGISTER_USER_FAILURE, error});

export const loginUserRequest = () => ({type: LOGIN_USER_REQUEST});
export const loginUserSuccess = user => ({type: LOGIN_USER_SUCCESS, user});
export const loginUserFailure = error => ({type: LOGIN_USER_FAILURE, error});

export const logoutUserSuccess = () => ({type: LOGOUT_USER_SUCCESS});

export const registerUser = userData => {
    return async dispatch => {
        try {
            dispatch(registerUserRequest());
            await axiosApp.post('/users', userData);
            dispatch(registerUserSuccess());
            dispatch(push('/'));
        } catch (error) {
            if (error.response) {
                dispatch(registerUserFailure(error.response.data));
            } else {
                dispatch(registerUserFailure({global: 'Network error or no internet'}));
            }
        }
    }
};

export const loginUser = userData => {
    return async dispatch => {
        try {
            dispatch(loginUserRequest());
            const response = await axiosApp.post('/users/sessions', userData);
            dispatch(loginUserSuccess(response.data));
            dispatch(push('/chat'));
        } catch (error) {
            dispatch(loginUserFailure(error.response.message));
        }
    }
};


export const logoutUser = () => {
    return async (dispatch, getState) => {
        const token = getState().users.user.token;
        const headers = {'Authorization': 'Token ' + token};

        await axiosApp.delete('/users/sessions', {headers});
        dispatch(push('/'));
        dispatch(logoutUserSuccess());
    }
};
