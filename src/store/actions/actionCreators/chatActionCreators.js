import * as actionTypes from '../actions';
import { getCallerReady } from '../actionIndex';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import axios from '../../../Axios';
import * as constants from '../../../shared/constants';

let currentUser = null;
let stompClient = null;
let ws = null;
export const initializeWebSocketConnection = () => {
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
    const { currentRoom } = getState().chat;
    if (currentRoom && currentRoom.id === messageResult.roomId){
        belongsToCurrentRoom = true;
    }
    dispatch(getRooms());
    dispatch(onNewMessage(messageResult, belongsToCurrentRoom));
      

}

export const sendMessageUsingSocket = message => {
    return dispatch => {
        console.log(message);
         stompClient.send("/socket-subscriber/send/message", {}, JSON.stringify(message));
    }
  }

export const chatInit = () => { 
    return (dispatch, getState) => {
        const { userId } = getState().auth;
        // user = userId;
        const chatManager = new ChatManager({
            instanceLocator: 'v1:us1:64b7dbdb-3e59-4fad-9823-83add90cba65',
            userId: userId,
            tokenProvider: new TokenProvider({
                url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/64b7dbdb-3e59-4fad-9823-83add90cba65/token'
            })
        });    
        chatManager
        .connect({
            onAddedToRoom: room => {
                // getRooms();
                // getMessages(room);
                dispatch(subscribeToRooms(currentUser))
            },
            // onUserLeftRoom: (room, user) => {
            //     if (userId !== user.id && room.isPrivate){
            //         let customMessage = `${user.id} has exited the room. You're all alone.`;
            //         currentUser.updateRoom({
            //             roomId: room.id,
            //             customData: { 'customMessage':  customMessage},
            //           })
            //     }
            // }
        })
        .then(user => {
            currentUser = user;
            dispatch(subscribeToRooms(currentUser))
            dispatch(chatInitSuccess(currentUser));
            dispatch(getRooms());
        })
        .catch(err => console.log(err));
    }
}

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

const sortContactsByDate = contacts => {
    return contacts.sort((a, b) => { 
        return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
    });
}

const chatInitSuccess = (currentUser, stompClient) => {
    return {
        type: actionTypes.CHAT_INIT_SUCCESS,
        currentUser,
        stompClient
    }
}
const onNewMessage = (message, belongsToCurrentRoom) => {
    return {
        type: actionTypes.ON_NEW_MESSAGE,
        message,
        belongsToCurrentRoom
    }
}

const subscriptionSuccessful = rooms => {
    return {
        type: actionTypes.SUBSCRIPTIONSUCCESSFUL,
        rooms
    }
}
const subscribeToRooms = user => {
    return (dispatch, getState) => {
        const contacts = sortContactsByDate(user.rooms);
        // dispatch(subscriptionSuccessful(contacts))
        dispatch(getRooms());
        contacts.map(con => {
            return  user.subscribeToRoom({
                 roomId: con.id,
                 hooks: {
                   onMessage: message => {
                     let belongsToCurrentRoom = false;
                     const { currentRoom } = getState().chat;
                    if (currentRoom && currentRoom.id === message.roomId){
                        belongsToCurrentRoom = true;
                    }
                    dispatch(getRooms());
                    dispatch(onNewMessage(message, belongsToCurrentRoom));
                   }
                 },
                 messageLimit: 0
               })
         })
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
    return dispatch => {
      
        let token = localStorage.getItem('token');
        axios.get(constants.GET_MESSAGES_URL(room.roomId), {headers: {'authorization': 'Bearer ' + token}})
        .then(res => {
            dispatch(fetchMessagesSuccess(res.data, room));
        })
        .catch(err => {
            console.log(`Error fetching messages: ${err}`);
        })
    }
   
}
export const sendMessage = data => {
    return dispatch => {
        currentUser.sendMessage(data);
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
            dispatch(subscribeToRooms());
          })
          .catch(err => {
            console.log(`Error creating room ${err}`);
            dispatch(createGroupFailed(err));
          })
    }
}
const startNewChatSuccess = () => {
    return {
        type: actionTypes.START_NEW_CHAT_SUCCESS
    }
}
const startNewChatFailed = err => {
    return {
        type: actionTypes.START_NEW_CHAT_FAILED,
        err
    }
}

const checkRoomDuplicity = (initiator, potentialParticipant) => {
    let roomName = `${initiator.id}and${potentialParticipant}`;
    let alternateRoomName = `${potentialParticipant}and${initiator.id}`;

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
        let token = localStorage.getItem('token');
        let user = JSON.parse(localStorage.getItem('user'));
        let { userId, profileImage }  = user;
        axios.get(`/search/${data.chatParticipant}`, {headers: {'x-auth-token': token}})
            .then(res => {
                let { isDuplicate, roomId } = checkRoomDuplicity(currentUser, data.chatParticipant);
                if (!isDuplicate){
                    currentUser.createRoom({
                        name: `${currentUser.id}and${data.chatParticipant}`,
                        private: true,
                        addUserIds: [data.chatParticipant],
                        customData: {
                            [userId]:  profileImage,
                            [data.chatParticipant]: res.data.avatar
                        }     
                    })
                        .then(res => {
                            console.log(res);
                            dispatch(startNewChatSuccess());
                            dispatch(subscribeToRooms(currentUser));
                        })
                        .catch(err => {
                            console.log(err);
                            dispatch(startNewChatFailed(err));
                        });
                } else {
                    currentUser.joinRoom({
                        roomId: roomId
                    }).then(res => {
                        console.log('Room successfully joined' + res);
                    }).catch(err => console.error(err));
                }
                
            })
            .catch(err => console.log(err));
    }
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