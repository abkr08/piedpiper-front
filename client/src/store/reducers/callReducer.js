import * as actionTypes from '../actions/actions';

const initialState = {
    channel: null,
    remoteStream: null,
    localStream: null,
    incomingCall: false,
    callType: null
}

const callReducer = (state = initialState, action) => {
    
    switch(action.type){
        case actionTypes.PREPARE_CALLER: 
            
            return {
                ...state,
                channel: action.channel,    
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
                ...state, incomingCall: true, callType: action.callType
            }
        default: 
        return state;
    }
}

export default callReducer;