import * as actionTypes from '../actions/actions';

const initialState = {
    token: null,
    user: null,
    userId: null,
    registrationSuccess: false,
    authError: null
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ON_AUTH_INIT:
            return {
                ...state, error: null
            }
        case actionTypes.LOG_IN:
           return {
               ...state, token: action.token, user: action.user, userId: action.user.userId, error: null
           }
        case actionTypes.LOG_OUT:
            return {
                ...state, token: null, userId: null
            }
        case actionTypes.ON_AUTH:
            return {
                ...state, token: action.token, userId: action.user.userId, user: action.user
            }
        case actionTypes.ON_REGISTER: 
            return {
                ...state, registrationSuccess: true
            }
        case actionTypes.LOG_IN_FAILED:
            return {
                ...state, authError: action.error
            }
        case actionTypes.ON_REGISTRATION_FAILED:
            return {
                ...state, authError: action.error
            }
        case actionTypes.PROFILE_UPDATE_SUCCESS:
            return {
                ...state, user: action.user
            }
        case actionTypes.RESET_FIELDS:
            let newState = {};
            let { fields } = action;
            fields.forEach(field => {
                if(state.hasOwnProperty(field)){
                    newState[field] = null;
                }
            })
            return {...state, ...newState }
        default: 
            return state;
    }
}

export default authReducer;