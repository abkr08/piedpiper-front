import * as actionTypes from '../actions';
import * as constants from "../../../shared/constants";
import axios from '../../../Axios';

const logInSuccess = (token, user) => {
    return {
        type: actionTypes.LOG_IN,
        token, 
        user
    }
}
const checkTokenValidity = expiresIn => {
    return dispatch => {
        setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("expiresIn");
            dispatch(logout());
        }, expiresIn);
    }
}

const onAuthInit = () => {
    return {
        type: actionTypes.ON_AUTH_INIT
    }
}
export const onLogIn = (data) => {
    return dispatch => {
        dispatch(onAuthInit())
        axios.post(constants.LOGIN_URL, data)
         .then(res => {
           const { user, token, expiresIn } = res.data;
           const expirationDate = new Date (new Date().getTime() + expiresIn);
           localStorage.setItem("token", token);
           localStorage.setItem("user", JSON.stringify(user));
           localStorage.setItem("expiresIn", expirationDate);
           dispatch(logInSuccess(res.data.token, user));
           dispatch(checkTokenValidity(expiresIn));
         })
         .catch(err => {
                console.log(err);
             dispatch(logInFailed(err))
         })
    }
}
const logInFailed = err => {
    return {
        type: actionTypes.LOG_IN_FAILED,
        error: err 
    }
}
const logout = () => {
    return {
        type: actionTypes.LOG_OUT
    }
}

export const onLogout = () => {
    return (dispatch, getState) => {
        //delete token saved in local storage
        let { stompClient } = getState().chat;
        stompClient.disconnect();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("expiresIn");
        dispatch(logout());
    }
}

const authSuccess = (token, user) => {
    return {
        type: actionTypes.ON_AUTH,
        token,
        user
    }
}
export const checkAuthState = () => {
    return dispatch => {
        let token = localStorage.getItem('token');
        if (token == 'undefined') {
            dispatch(logout());
        } else {
            const expirationDate = new Date (localStorage.getItem('expiresIn'));
            if (expirationDate <= new Date()){
                dispatch(logout)
            } else {
                const user = JSON.parse(localStorage.getItem('user'));
                dispatch(authSuccess(token, user));
                dispatch(checkTokenValidity((expirationDate.getTime() - new Date().getTime())));
            
            }
        }
    }
}
const registered = () => {
    return {
        type: actionTypes.ON_REGISTER,
    }
}
const registrationFailed = err => {
    return {
        type: actionTypes.ON_REGISTRATION_FAILED,
        error: err
    }
}
export const onRegister = data => {
    return dispatch => {
        dispatch(onAuthInit())
        axios.post(constants.REGISTRATION_URL, data)
            .then(res => {
                dispatch(registered());
            })
            .catch(err => {
                dispatch(registrationFailed(err))
            });
    }
}

const updatingProfile = () => ({
    type: actionTypes.UPDATING_PROFILE
})

const profileUpdated = user => ({
    type: actionTypes.PROFILE_UPDATE_SUCCESS,
    user
})

const profileUpdateFailed = error => ({
    type: actionTypes.PROFILE_UPDATE_FAILED,
    error
})
export const updateProfile = data => {
    return dispatch => {
        dispatch(updatingProfile())
        let token = localStorage.getItem('token');
        let user = JSON.parse(localStorage.getItem('user'));
        axios.post(constants.UPDATE_PROFILE_URL(user.username), data, {headers: {'authorization': 'Bearer ' + token}})
            .then(res => {
                console.log('Success ' + res.data);
                let newProfile = res.data;
                user.profile = newProfile;
                localStorage.setItem('user', JSON.stringify(user));
                dispatch(profileUpdated(user))
            }).catch(err => dispatch(profileUpdateFailed(err)))
    }
}