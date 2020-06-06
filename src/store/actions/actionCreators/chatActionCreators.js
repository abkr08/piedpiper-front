import * as actionTypes from '../actions';
import { sortContactsByDate } from '../../../shared/utility'
import UIfx from 'uifx';
import { getCallerReady } from '../actionIndex';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import Dexie from 'dexie';
import axios from '../../../Axios';
import * as constants from '../../../shared/constants';
import ding from '../../../assets/audio/ding.mp3';

let currentUser = null;
let stompClient = null;
let db = null;
let ws = null;

const dingg = new UIfx(
    ding,
    {
      volume: 0.1, // number between 0.0 ~ 1.0
      throttleMs: 100
    }
)

export const initializeWebSocketConnection = () => {
    initializeDB();
    currentUser = JSON.parse(localStorage.getItem("user"));
    return (dispatch, getState) => {
        connectAndReconnect(() => openSocket(dispatch, getState));
}
}

const connectAndReconnect = (successCallback) => {
    ws = new SockJS(constants.WS_SERVER_URL);
    stompClient = Stomp.over(ws);
    // stompClient.debug = null;
    stompClient.connect({}, (frame) => {
        if(stompClient.connected){
            successCallback();
        } 
    }, () => {
      setTimeout(() => {
        connectAndReconnect(successCallback);
      }, 5000);
    });
  }

const openSocket = (dispatch, getState) => {
    const { rooms } = currentUser;
    subscribeToOwnChannel(dispatch, getState);
    rooms.forEach(room => {
        stompClient.subscribe("/socket-publisher/" + room.roomId, message => {
            handleResult(dispatch, getState, message);
        });
    });
    dispatch(chatInitSuccess(currentUser, stompClient));
    dispatch(getCallerReady(stompClient))   
}

const handleResult = (dispatch, getState, message) => {
    let messageResult = JSON.parse(message.body);
    let belongsToCurrentRoom = false;
    const { currentRoom, rooms } = getState().chat;
    if (currentRoom && currentRoom.roomId === messageResult.roomId){
        belongsToCurrentRoom = true;
    }
    let user = JSON.parse(localStorage.getItem('user'));
    if (messageResult.sender !== user.username){
        dingg.play();
    }
    let index = findRoomIndex(rooms, messageResult.roomId);
    rooms[index].updatedAt = new Date;
    user.rooms = rooms; 
    localStorage.setItem('user', JSON.stringify(user));
    dispatch(onNewMessage(messageResult, belongsToCurrentRoom, sortContactsByDate(rooms)));
}

const subscribeToOwnChannel = (dispatch, getState) => {
    stompClient.subscribe(`/socket-publisher/${currentUser.username}`, notification => {
        handleNotification(notification, dispatch, getState);
    });
}

const handleNotification = (data, dispatch, getState) => {
    let notification = JSON.parse(data.body);
    switch(notification.type){
        case 'chatRequest':
            handleChatRequest(notification.data, dispatch);
            break;
        case 'acceptChatRequest':
            handleChatRequestAccepted(notification.data, dispatch, getState);
            break;
        case 'denyChatRequest':
            handleChatRequestDenied(notification.data, dispatch);
            break;
        default:
            dispatch({type: actionTypes.ON_NEW_NOTIFICATION, data: notification.data})
    }
}

const onChatRequest = rooms => ({ type: actionTypes.ON_CHAT_REQUEST, rooms});
const chatRequestAccepted = (rooms, currentRoom) => ({ type: actionTypes.CHAT_REQUEST_ACCEPTED, rooms, currentRoom});
const chatRequestDenied = (rooms, room) => ({ type: actionTypes.CHAT_REQUEST_DENIED, rooms, room});

const handleChatRequest = (room, dispatch, getState) => {
    let user  = JSON.parse(localStorage.getItem('user')); 
    let { rooms } = user;
    rooms.push(room);
    user = { ...user, rooms }
    localStorage.setItem('user', JSON.stringify(user));
    dispatch(onChatRequest(sortContactsByDate(rooms)));
}
const findRoomIndex = (rooms, id) => {
    for (let i = 0; i < rooms.length; i++){
        let rm = rooms[i];
        if(rm.roomId == id){
            return i;
        }
    }
    return -1;
} 
const handleChatRequestAccepted = (room, dispatch, getState) => {
    subscribeToRoom(dispatch, getState, room.roomId);
    let user = JSON.parse(localStorage.getItem('user')); 
    let { rooms } = user;
    let index = findRoomIndex(rooms, room.roomId);
    room.isARequest = false;
    rooms[index] = room;
    user = { ...user, rooms }
    localStorage.setItem('user', JSON.stringify(user));
    dispatch(chatRequestAccepted(sortContactsByDate(rooms), room));
}

const handleChatRequestDenied = (room, dispatch) => {
    let user = JSON.parse(localStorage.getItem('user')); 
    let { rooms } = user;
    rooms = rooms.filter(rm => rm.roomId !== room.roomId);
    user = { ...user, rooms }
    localStorage.setItem('user', JSON.stringify(user));
    dispatch(chatRequestDenied(sortContactsByDate(rooms), room));
}
const initializeDB = () => {
    if (!('indexedDB' in window)) {
        console.warn('IndexedDB not supported')
        return
    }
    db = new Dexie("Piperchat-db");
    db.version(1).stores({ messages: "roomId,id,text,sender" });
}

export const sendMessage = message => {
    return dispatch => {
        stompClient.send("/socket-subscriber/send/message", {}, JSON.stringify(message));
        let user = JSON.parse(localStorage.getItem('user'));
        let { rooms } = user;
        let index = findRoomIndex(rooms, message.roomId);
        rooms[index].updatedAt = new Date();
        user = { ...user, rooms }
        localStorage.setItem('user', JSON.stringify(user));
        dispatch(messageSent(sortContactsByDate(rooms)));
    }
}

const messageSent = rooms => ({ type: actionTypes.MESSAGE_SENT, rooms})

const getRooms = () => {
    return dispatch => {
        const contacts = currentUser.rooms.map(room => {
            let obj = {};
            let name = !room.isPrivate ? room.name :
                        room.name.split('and')
                            .filter(name => name !== currentUser.id).join('');
            !name.length ? obj.name = currentUser.id : obj.name = name;
            obj.id = room.id;
            return {...room, ...obj};
        })
        let sortedContacts = sortContactsByDate(contacts);
        dispatch({type: 'ON_ROOMS_FETCHED', contacts: sortedContacts })
    }
}

const chatInitSuccess = (currentUser, stompClient) => {
    return {
        type: actionTypes.CHAT_INIT_SUCCESS,
        currentUser,
        stompClient
    }
}
const onNewMessage = (message, belongsToCurrentRoom, rooms) => {
    return {
        type: actionTypes.ON_NEW_MESSAGE,
        message,
        belongsToCurrentRoom,
        rooms
    }
}

const SUBSCRIPTION_SUCCESSFUL = rooms => {
    return {
        type: actionTypes.SUBSCRIPTION_SUCCESSFUL,
        rooms
    }
}

const fetchMessagesSuccess = (messages, room) => {
    return {
        type: actionTypes.FETCH_MESSAGES_SUCCESS,
        messages,
        room
    }
}
export const getMessages = room => {
    return (dispatch, getState) => {
        let token = localStorage.getItem('token');
        let { messages, unopenedMessages } = getState().chat;
        if (messages.hasOwnProperty(room.roomId)){
            let messagesCopy = { ...messages };
            if(unopenedMessages.hasOwnProperty(room.roomId)){
                messagesCopy[room.roomId] = messagesCopy[room.roomId].concat(unopenedMessages[room.roomId]);
            }
            dispatch({type: actionTypes.CHANGE_ROOM, room, messages: messagesCopy })
            return;
        }
        axios.get(constants.GET_MESSAGES_URL(room.roomId), {headers: {'authorization': 'Bearer ' + token}})
        .then(res => {
            dispatch(fetchMessagesSuccess(res.data, room));
        })
        .catch(err => {
            console.log(`Error fetching messages: ${err}`);
        })
    }
   
}

const createGroupSuccess = () => {
    return {
        type: actionTypes.CREATE_GROUP_SUCCESS
    }
}
const createGroupFailed = err => {
    return {
        type: actionTypes.CREATE_GROUP_FAILED,
        err
    }
}
export const createNewGroup = data => {
    return dispatch => {
        currentUser.createRoom({
            name: data.name,
            private: false,
            addUserIds: data.participants,
            customData: { 
                displayImage: 'https://api.adorable.io/avatars/285/abott@adorable.png'
             },
          }).then(room => {
            console.log(`Created room called ${room.name}`);
            dispatch(createGroupSuccess());
            // dispatch(subscribeToRooms());
          })
          .catch(err => {
            console.log(`Error creating room ${err}`);
            dispatch(createGroupFailed(err));
          })
    }
}
const startNewChatSuccess = (rooms, room) => {
    return {
        type: actionTypes.START_NEW_CHAT_SUCCESS,
        room,
        rooms
    }
}
const startNewChatFailed = err => {
    return {
        type: actionTypes.START_NEW_CHAT_FAILED,
        error: err
    }
}

const checkRoomDuplicity = (initiator, potentialParticipant) => {
    let roomName = `${initiator.username}and${potentialParticipant}`;
    let alternateRoomName = `${potentialParticipant}and${initiator.username}`;

    let roomExists = initiator.rooms.findIndex(room => {
        console.log(roomName, alternateRoomName, room.name)
        if(room['name'] === roomName || room['name'] === alternateRoomName)
        {
          return true;
        }
        return false;

    });
    
    if (roomExists !== -1){
        return { isDuplicate: true, roomId: initiator.rooms[roomExists].id}
    }
    return { isDuplicate: false }
}
export const startNewChat = data => {
    return dispatch => {
        let user = JSON.parse(localStorage.getItem('user'));
        if (data.chatParticipant == user.username){
            let error = {error: 'You cannot create a private room with yourself. There\'s only one of you' };
            dispatch(startNewChatFailed(error));
            return;
        }
        let token = localStorage.getItem('token');
        let roomData = {
            "roomType": 1,
            "participants": [user.username, data.chatParticipant],
            "alternateRoomName": data.chatParticipant + 'and' + user.username,
            "name": user.username + 'and' + data.chatParticipant,
            "createdBy": user.username
        }
        
        let { isDuplicate, roomId } = checkRoomDuplicity(user, data.chatParticipant);
        if (!isDuplicate){
        axios.post(constants.NEW_ROOM_URL, roomData, {
            headers: {'authorization': 'Bearer ' + token}
        }).then(res => {
            let { rooms }  = user;
            rooms.push(res.data);
            console.log(rooms, res.data);
            localStorage.setItem('user', JSON.stringify(user));
            dispatch(startNewChatSuccess(sortContactsByDate(rooms), res.data));
            })
            .catch(err => {
                // console.log(err.response);
                dispatch(startNewChatFailed(err.response.data));
            });
            } else {
                let error = {error: 'Room already exists'};
                dispatch(startNewChatFailed(error));
            }
    }
}

export const acceptChatRequest = room => {
    return (dispatch, getState) => {
        let message = {
            type: 'acceptChatRequest',
            data: room,
            to: room.createdBy,
            from: currentUser.username
        };
        sendNotification(message);
        subscribeToRoom(dispatch, getState, room.roomId);
        let user = JSON.parse(localStorage.getItem('user'));
        let { rooms } = user;
        let index = findRoomIndex(rooms, room.roomId);
        rooms[index].isARequest = false;
        user = { ...user, rooms }
        localStorage.setItem('user', JSON.stringify(user));
        dispatch({type: actionTypes.ON_ACCEPT_CHAT_REQUEST, rooms: sortContactsByDate(rooms), currentRoom: rooms[index] })
        
    }
}

const sendNotification = notification => {
    stompClient.send(`/socket-subscriber/${notification.to}`, {}, JSON.stringify(notification))
}
export const denyChatRequest = room => {
    return dispatch => {
        let message = {
            type: 'denyChatRequest',
            data: room,
            to: room.createdBy
        };
        handleChatRequestDenied(room, dispatch);
        sendNotification(message);
    }
}

const subscribeToRoom = (dispatch, getState, id) => {
    stompClient.subscribe("/socket-publisher/" + id, message => {
        handleResult(dispatch, getState, message);
    });
}

export const joinRoom = roomId => {
    return dispatch => {    
        currentUser.joinRoom({ roomId })
            .then(room => {
                console.log(`Joined room with ID: ${room.id}`)
            })
            .catch(err => {
                console.log(`Error joining room ${roomId}: ${err}`)
            })
    }
}

export const deleteChat = roomId => {
    return dispatch => {
        console.log(typeof roomId)
        currentUser.leaveRoom({ roomId: roomId })
        .then(() => {
          console.log(`Deleted room with ID: ${roomId}`);
          //dispatch(subscribeToRooms());
        //   dispatch(chatInitSuccess());
        dispatch(getRooms())
        })
        .catch(err => {
          console.log(`Error deleted room ${roomId}: ${err}`)
        });
    }
}