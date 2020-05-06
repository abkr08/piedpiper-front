import * as actionTypes from '../actions';

export const resetFields = fields => {
    return dispatch => {
        dispatch({type: actionTypes.RESET_FIELDS, fields})
    } 
}