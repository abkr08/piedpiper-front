import { store }  from '../../../index';
import * as actionTypes from '../actions';
// import io from 'socket.io-client'; 


let connectedUser;
let currentUsername;
const config = {};

const configuration = { 
    "iceServers": [{ "urls": "stun:stun2.1.google.com:19302" }]
};

let stompClient = null;
let conn = null;
let stream = null;

const prepareCaller = channel => {
    return {
        type: actionTypes.PREPARE_CALLER,
        channel: channel
    }
}
export const getCallerReady = client => {
    stompClient = client;
    return (dispatch, getState) => {
        let { currentUser: { username } } = getState().chat;
        currentUsername = username;
        stompClient.subscribe("/socket-publisher/call/" + username, message => {
            handleMessage(message);
        })
        
    }
}
//when we got a message from a signaling server 
const handleMessage = message => { 

//    console.log("Got message", message);
	
   const data = JSON.parse(message.body); 
	
   switch(data.type) { 
    case "requestToCall":
        //prepare user for call
        console.log('received a request from ' + data.from);
        handleRequest(data.from); 
        break;
    case "answerToRequest":
        //user is ready...send them an offer
        console.log('received an answer from ' + data.from);
        createOffer(data.from); 
        break;
    //when somebody wants to call us 
    case "offer":
        // onlyAllowOneCall(() => handleOffer(data.offer));
        handleOffer(data.offer)
        break; 
    case "answer": 
        // onlyAllowOneCall(() => handleAnswer(data.answer, data.from)); 
        handleAnswer(data.answer, data.from)
        break; 
    //when a remote peer sends an ice candidate to us 
    case "candidate": 
        handleCandidate(data.candidate); 
        break; 
    case "rejection":
        handleCallRejection(data)
        handleLeave();
        break;
    case "leave": 
        handleLeave(); 
        break; 
    default: 
        break; 
   }
}

const createOffer = to => {
    // create an offer 
    conn.createOffer(offer => { 
        send({ 
            type: "offer", 
            offer: offer,
            to: connectedUser
        });    
        conn.setLocalDescription(offer); 
        }, error => { 
        console.log("Error when creating an offer", error); 
        });
}
const handleRequest = from => {
    connectedUser = from;
    store.dispatch({type: actionTypes.ON_INCOMING_CALL, callType: 'video', caller: from});
    conn = new RTCPeerConnection(configuration);
        //when a remote user adds stream to the peer connection, we display it 
        conn.ontrack = function (stream) { 
            console.log('got remote stream');
            store.dispatch(onTrack(stream));
        };
        // Setup ice handling 
        conn.onicecandidate = event => { 
        if (event.candidate) { 
            send({ 
                type: "candidate", 
                candidate: event.candidate,
                to: connectedUser
            }); 
        } 
        }
        getMedia().then(gotStream).catch(err => console.log(err));
}
//alias for sending JSON encoded messages 
function send(message) {
    if(stompClient && stompClient.connected){
        stompClient.send("/socket-subscriber/call", {}, JSON.stringify(message));
    }
};

const getMedia = () => {
    return navigator.mediaDevices.getUserMedia({
        video: {
            width: 1280,
                height: 720,
                frameRate: 15
            },
        audio: true
      });
}

export const callUser = (user, type) => {
    connectedUser = user;
    config.type = type;
    console.log('calling ' + user + '....' );
    return dispatch => {
        conn = new RTCPeerConnection(configuration);
        //when a remote user adds stream to the peer connection, we display it 
        conn.ontrack = stream => { 
            dispatch(onTrack(stream));
        };
        // Setup ice handling 
        conn.onicecandidate = event => { 
        if (event.candidate) { 
            send({ 
                type: "candidate", 
                candidate: event.candidate,
                to: connectedUser
            }); 
        } 
        }
        getMedia().then(stream => gotStream(stream, true))
        .catch(e => {
            dispatch(onError(e));
            console.log(`getUserMedia() error: ${e}`)
        });       
    }
  }

  const onError = err => {
      return {
          type: actionTypes.ON_ERROR,
          error: err
      }
  }

const gotStream = (myStream, isInit) => {
    store.dispatch({type: actionTypes.CALL_INIT})
    if (isInit){
        send({
            type: 'requestToCall',
            from: currentUsername,
            to: connectedUser
        })
    }
    stream = myStream;
    store.dispatch(onLocalStream(myStream));
    myStream.getTracks().forEach(track => {
        conn.addTrack(track, myStream)
    });
}

const onTrack = track => {
    return {
        type: actionTypes.ON_TRACK,
        remoteStream: track.streams[0]
    }
}

const onLocalStream = stream => {
    return {
        type: actionTypes.ON_LOCAL_STREAM,
        stream: stream
    }
}

function onlyAllowOneCall(fn){
    var hasBeenCalled = false;    
    return function(){
         if (hasBeenCalled){
              throw Error("Attempted to call callback twice")
         }
         hasBeenCalled = true;
         return fn.apply(this, arguments)
    }
}

function handleOffer(offer) {
    // debugger;
    console.log('Accepting offer from ' + connectedUser);
    conn.setRemoteDescription(new RTCSessionDescription(offer));
    //create an answer to an offer 
    console.log('Creating and sending answer to ' + connectedUser);
    conn.createAnswer(answer => { 
        send({ 
            type: "answer", 
            answer: answer,
            from: currentUsername,
            to: connectedUser
       });
       if(conn.signalingState !== "stable"){
            conn.setLocalDescription(answer)//.then(null).catch(err => {debugger});
       }
        
    }, error => {
       console.log("Error when creating an answer"); 
    }); 
}
export const callAccepted = () => {
    return dispatch => {
        send({
            type: 'answerToRequest',
            to: connectedUser,
            from: currentUsername
        })
        dispatch({type: actionTypes.CALL_ACCEPTED})
    }
}
export const callRejected = caller => {
    send({
        type: 'rejection',
        by: currentUsername,
        to: connectedUser
    })
    return dispatch => {
        dispatch({type: actionTypes.CALL_REJECTED})
    }
}

const handleCallRejection = data => {
    store.dispatch({type: actionTypes.CALL_REJECTED})
}
function handleAnswer(answer, name) { 
    console.log('Accepting answer from ' + name);
    // debugger;
    if(conn.signalingState !== "stable"){
        conn.setRemoteDescription(new RTCSessionDescription(answer));
    }
};
function handleCandidate(candidate) { 
    conn.addIceCandidate(new RTCIceCandidate(candidate)); 
};

const callEnded = () => {
    return {
        type: actionTypes.END_CALL
    }
}
export const endCall = () => {
    return dispatch => {
        send({ 
            type: "leave",
            to: connectedUser 
         }); 
        handleLeave(); 
    }
}

function handleLeave() { 
    connectedUser = null; 
    stream.getTracks().forEach(track => track.stop());
    store.dispatch(callEnded()); 
    store.dispatch(prepareCaller())
    conn.close();
    conn.onicecandidate = null; 
    conn.onaddTrack = null;
 };