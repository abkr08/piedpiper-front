import { store }  from '../../../index';
import * as actionTypes from '../actions';
import io from 'socket.io-client'; 

let name; 
let connectedUser;
const userId = localStorage.getItem('userId');
const config = {};

//connecting to our signaling server
const conn = io('http://localhost:8082')
// const conn = io('https://piedpiperchat.herokuapp.com:8082')
const configuration = { 
    "iceServers": [{ "url": "stun:stun2.1.google.com:19302" }]
};
const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
};
let yourConn;
let stream = null;

console.log(conn);
conn.on('connection', function () { 
   console.log("Connected to the signaling server"); 
});

const prepareCaller = channel => {
    return {
        type: actionTypes.PREPARE_CALLER,
        channel: channel
    }
}
export const getCallerReady = () => {
    return dispatch => {
        send({ 
            type: "login", 
            name: userId
         });   
        dispatch(prepareCaller(conn));
    }
}
//when we got a message from a signaling server 
conn.on('message', function (msg) { 

   console.log("Got message", msg);
	
   const data = JSON.parse(msg); 
	
   switch(data.type) { 
    case "login": 
        //  handleLogin(data.success); 
        console.log('logged in')
        break; 
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
        handleOffer(data.offer, data.name)
        break; 
    case "answer": 
        handleAnswer(data.answer, data.from); 
        break; 
    //when a remote peer sends an ice candidate to us 
    case "candidate": 
        handleCandidate(data.candidate); 
        break; 
    case "leave": 
        handleLeave(); 
        break; 
    default: 
        break; 
   }
});
  
conn.onerror = function (err) { 
   console.log("Got error", err); 
};

const createOffer = to => {
    // create an offer 
    yourConn.createOffer(function (offer) { 
        send({ 
            type: "offer", 
            offer: offer 
        }); 
            
        yourConn.setLocalDescription(offer); 
        }, function (error) { 
        alert("Error when creating an offer"); 
        });
}
const handleRequest = from => {
    connectedUser = from;
    store.dispatch({type: actionTypes.ON_INCOMING_CALL, callType: 'video', caller: from});
    yourConn = new RTCPeerConnection(configuration);
        
        //when a remote user adds stream to the peer connection, we display it 
        yourConn.ontrack = function (stream) { 
            console.log('got remote stream');
            console.log(stream)
        store.dispatch(onTrack(stream));
        };
        console.log(yourConn);
        // Setup ice handling 
        yourConn.onicecandidate = function (event) { 
        if (event.candidate) { 
            send({ 
                type: "candidate", 
                candidate: event.candidate
            }); 
        } 
        }
    getMedia().then(gotStream).catch(err => console.log(err));
}
//alias for sending JSON encoded messages 
function send(message) { 
   //attach the other peer username to our messages 
   if (connectedUser) { 
      message.name = connectedUser; 
   } 
	
   conn.send(JSON.stringify(message)); 
};

const getMedia = () => {
    return navigator.mediaDevices.getUserMedia({
        video: {width: 1280,
                height: 720,
                frameRate: 15},
        // config.callType === 'video' ? {width: 1280,
        //     height: 720,
        //     frameRate: 15}: false,
        audio: true
      });
}

export const callUser = (user, type) => {
    connectedUser = user;
    config.type = type;
    console.log('calling ' + user + '....' );
    return dispatch => {
        yourConn = new RTCPeerConnection(configuration);
        
        //when a remote user adds stream to the peer connection, we display it 
        yourConn.ontrack = function (stream) { 
            console.log('got remote stream');
            console.log(stream)
        store.dispatch(onTrack(stream));
        };
        console.log(yourConn);
        // Setup ice handling 
        yourConn.onicecandidate = function (event) { 
        if (event.candidate) { 
            send({ 
                type: "candidate", 
                candidate: event.candidate
            }); 
        } 
        }
        getMedia().then(gotStream)
        .catch(e => console.log(`getUserMedia() error: ${e}`));
        dispatch({type: actionTypes.CALL_INIT})
        send({
            type: 'requestToCall',
            from: userId,
            to: connectedUser
        })        
    }
  }  

const gotStream = myStream => {
    console.log('Received local stream');
    stream = myStream;
    store.dispatch(onLocalStream(myStream));
    myStream.getTracks().forEach(track => {
        console.log(track);
            yourConn.addTrack(track, myStream)
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
function handleOffer(offer, name) { 
    console.log('Accepting offer from ' + connectedUser);
    yourConn.setRemoteDescription(new RTCSessionDescription(offer));
     
    //create an answer to an offer 
    console.log('Creating and sending answer to ' + connectedUser);
    yourConn.createAnswer(function (answer) { 
        yourConn.setLocalDescription(answer); 
        send({ 
            type: "answer", 
            answer: answer,
            from: name 
       }); 
         
    }, function (error) { 
       alert("Error when creating an answer"); 
    }); 
}
export const callAccepted = () => {
    return dispatch => {
        send({
            type: 'answerToRequest',
            to: connectedUser,
            from: userId
        })
        dispatch({type: actionTypes.CALL_ACCEPTED})
    }
}
export const callRejected = () => {
    return dispatch => {
        // channel.trigger("client-reject", { room: config.room, rejected: userId });
        dispatch({type: actionTypes.CALL_REJECTED})
    }
}
function handleAnswer(answer, name) { 
    console.log('Accepting answer from ' + name)
   yourConn.setRemoteDescription(new RTCSessionDescription(answer)); 
};
function handleCandidate(candidate) { 
    yourConn.addIceCandidate(new RTCIceCandidate(candidate)); 
};

const callEnded = () => {
    return {
        type: actionTypes.END_CALL
    }
}
export const endCall = () => {
    return dispatch => {
        console.log(connectedUser)
        send({ 
            type: "leave",
            name: connectedUser 
         }); 
        handleLeave(); 
    }
}

function handleLeave() { 
    connectedUser = null; 
    stream.getTracks().forEach(track => track.stop());
    store.dispatch(callEnded()); 
    yourConn.close(); 
    yourConn.onicecandidate = null; 
    yourConn.onaddTrack = null;
 };