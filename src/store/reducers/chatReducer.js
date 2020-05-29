import * as actionTypes from '../actions/actions';


const initialState = {
    currentUser: null,
    contacts: [],
    currentRoom: null,
    messages: [],
    unopenedMessages: {},
    startNewChatError: null,
};

const removeItem = (obj, item) => {
    return Object.keys(obj).reduce((acc, key) => {
        if (key !== item) {
          return {...acc, [key]: obj[key]}
        }
        return acc;
      }, {})
} 
const chatReducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.CHAT_INIT_SUCCESS:
            return {
                ...state, currentUser: action.currentUser, stompClient: action.stompClient
            }
        case actionTypes.FETCH_MESSAGES_SUCCESS: {
            return {
                ...state, messages: action.messages, currentRoom: action.room,
                unopenedMessages: removeItem(state.unopenedMessages, action.roomId)
            }
        }
        case actionTypes.ON_NEW_MESSAGE: 
            if (action.belongsToCurrentRoom || action.message.sender == state.currentUser.username){
                return {
                    ...state, messages: [...state.messages, action.message]
                }
            } else {
                let unopenedMessagesCopy = {...state.unopenedMessages};
                if (unopenedMessagesCopy.hasOwnProperty(action.message.roomId)){
                    unopenedMessagesCopy[action.message.roomId].push(action.message);
                } else {
                    unopenedMessagesCopy[action.message.roomId] = [action.message];
                }
                return { 
                    ...state, unopenedMessages: unopenedMessagesCopy
               }  
            }
        case actionTypes.ON_ROOMS_FETCHED:
            return {
                ...state, contacts: action.contacts
            }
        case actionTypes.SUBSCRIPTIONSUCCESSFUL:
            return {
                ...state, contacts: action.rooms
            }
        case actionTypes.RESET_FIELDS:
            let newState = {};
            let { fields } = action;
            fields.forEach(field => {
                if(state.hasOwnProperty(field)){
                    newState[field] = null;
                }
            })
            return { ...state, ...newState }
        case actionTypes.START_NEW_CHAT_FAILED:
            return { ...state, startNewChatError: action.error }
        case actionTypes.START_NEW_CHAT_SUCCESS:
            return { ...state, contacts: [...state.contacts, action.room], currentRoom: action.room}
        default: 
            return state;
    }
}

export default chatReducer;