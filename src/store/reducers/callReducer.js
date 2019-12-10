import * as actionTypes from '../actions/actions';

const initialState = {
    channel: null,
    remoteStream: null,
    localStream: null,
    incomingCall: false,
    callType: null,
    caller: null,
    callOngoing: false,
    callStarted: false,
    callEnded: false,
    error: null
}

const callReducer = (state = initialState, action) => {
    
    switch(action.type){
        case actionTypes.PREPARE_CALLER: 
            return {
                ...initialState,
                channel: action.channel 
            }
        case actionTypes.CALL_INIT: 
            return {
                ...state, callStarted: true, callEnded: false
            }
        case actionTypes.ON_TRACK: 
            return {
                ...state, remoteStream: action.remoteStream
            }
        case actionTypes.ON_LOCAL_STREAM:
            return {
                ...state, localStream: action.stream
            }
        case actionTypes.ON_INCOMING_CALL:
            return {
                ...state, incomingCall: true, callType: action.callType, caller: action.caller
            }
        case actionTypes.CALL_ACCEPTED: 
            return {
                ...state, incomingCall: false, callOngoing: true
            }
        case actionTypes.CALL_REJECTED: 
            return {
                ...state, incomingCall: false, callOngoing: false
            }
        case actionTypes.END_CALL: 
            return {
                ...state, callOngoing: false, incomingCall: false, callEnded: true, callStarted: false, error: null
            }
        case actionTypes.ON_ERROR:
            return {
                ...state, error: action.error
            }
        default: 
        return state;
    }
}

export default callReducer;