import * as actionTypes from '../actions/actions';


const initialState = {
    currentUser: null,
    contacts: [],
    currentRoom: null,
    messages: [],
    unopenedMessages: {}
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
                ...state, currentUser: action.currentUser
            }
        case actionTypes.FETCH_MESSAGES_SUCCESS: {
            return {
                ...state, messages: action.messages, currentRoom: action.room,
                unopenedMessages: removeItem(state.unopenedMessages, action.room.id)
            }
        }
        case actionTypes.ON_NEW_MESSAGE: 
            if (action.belongsToCurrentRoom){
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
        case 'ON_ROOMS_FETCHED':
            return {
                ...state, contacts: action.contacts
            }
        case actionTypes.SUBSCRIPTIONSUCCESSFUL:
            return {
                ...state, contacts: action.rooms
            }
        default: 
            return state;
    }
}

export default chatReducer;