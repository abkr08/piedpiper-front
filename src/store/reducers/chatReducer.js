import * as actionTypes from '../actions/actions';


const initialState = {
    currentUser: null,
    rooms: null,
    currentRoom: null,
    messages: {},
    unopenedMessages: {},
    startNewChatError: null,
    contactSearchSuccessful: null
};

const removeItem = (obj, item) => {
    return Object.keys(obj).reduce((acc, key) => {
        if (key != item) {
            console.log(acc, key, item);
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
        
        case actionTypes.ON_ROOMS_LOADED:
            return {
                ...state, rooms: action.rooms
            }

        case actionTypes.FETCH_MESSAGES_SUCCESS: 
            return {
                ...state, messages: {...state.messages, [action.room.roomId]: action.messages }, currentRoom: action.room,
                unopenedMessages: removeItem(state.unopenedMessages, action.room.roomId)
            }

        case actionTypes.CHANGE_ROOM:
            const { room } = action;
            return { 
                ...state, currentRoom: room, 
                unopenedMessages: removeItem(state.unopenedMessages, room.roomId), messages: action.messages
            }
        
        case actionTypes.MESSAGE_SENT:
            return {...state, rooms: action.rooms }
        
        case actionTypes.ON_NEW_MESSAGE:
            const {  belongsToCurrentRoom, message } = action;
            const { roomId } = message;
            let newState = {
                ...state, rooms: action.rooms }
            
            if (!belongsToCurrentRoom) {
                let unopenedMessagesCopy = {...state.unopenedMessages};
                if (unopenedMessagesCopy.hasOwnProperty(roomId)){
                    unopenedMessagesCopy[roomId].push(message);
                } else {
                    unopenedMessagesCopy[roomId] = [message];
                } 
                newState['unopenedMessages'] = unopenedMessagesCopy;
            } else {
                if (!newState.messages.hasOwnProperty(roomId)){
                    newState.messages[roomId] = [];
                }
                newState.messages = {...newState.messages, [roomId]: [...state.messages[roomId], message]}
            }
            return newState;
            
        case actionTypes.SUBSCRIPTION_SUCCESSFUL:
            return {
                ...state, rooms: action.rooms
            }

        case actionTypes.RESET_FIELDS:
            let stateCopy = {};
            let { fields } = action;
            fields.forEach(field => {
                if(state.hasOwnProperty(field)){
                    stateCopy[field] = null;
                }
            })
            return { ...state, ...stateCopy }
        case actionTypes.CHAT_REQUEST_ACCEPTED:
            newState = { ...state, rooms: action.rooms }
            if(state.currentRoom.roomId == action.currentRoom.roomId){
                newState.currentRoom = action.currentRoom;
            } 
            return newState;
        case actionTypes.CHAT_REQUEST_DENIED:
            return {
                ...state, rooms: action.rooms
            }
        case actionTypes.ON_CHAT_REQUEST:
            return {
                ...state, rooms: action.rooms
            }

        case actionTypes.START_NEW_CHAT_FAILED:
            return { ...state, startNewChatError: action.error }
        
        case actionTypes.START_NEW_CHAT_SUCCESS:
            return { ...state, rooms: action.rooms, currentRoom: action.room, contactSearchSuccessful: true}

        case actionTypes.ON_ACCEPT_CHAT_REQUEST:
            return {
                ...state, rooms: action.rooms, currentRoom: action.currentRoom
            } 

        default: 
            return state;
    }
}

export default chatReducer;