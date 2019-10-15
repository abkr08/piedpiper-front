import * as actionTypes from '../actions/actions';

const initialState = {
    token: null,
    userId: null,
    registrationSuccess: false,
    error: null
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOG_IN:
           return {
               ...state, token: action.token, userId: action.userId, error: null
           }
        case actionTypes.LOG_OUT:
            return {
                ...state, token: null, userId: null
            }
        case actionTypes.ON_AUTH:
            return {
                ...state, token: action.token, userId: action.userId
            }
        case actionTypes.ON_REGISTER: 
            return {
                ...state, registrationSuccess: true
            }
        case actionTypes.LOG_IN_FAILED: 
        return {
            ...state, error: action.error
        }
        default: 
            return state;
    }
}

export default authReducer;