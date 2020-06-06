import { store }  from '../../../index';
import * as actionTypes from '../actions';
import UIfx from 'uifx';
import {Howl, Howler} from 'howler';
import simpleRing from '../../../assets/audio/simple_ring.mp3'; 


let connectedUser;
let currentUsername;
const config = {};

const configuration = { 
    iceServers: [
        {   urls: [ "stun:tk-turn2.xirsys.com" ]},
        {   username: "ibJsMz4qXATWVjMFqEMHBGn9qfBwA0ENbcnNG9fDjGNN-Ez-k8KxQ3JbE8q1olyrAAAAAF7bpJFhYmtyMDg=",   
            credential: "e9f8bd4e-a7ff-11ea-ab43-0242ac140004",   
            urls: [       
                "turn:tk-turn2.xirsys.com:80?transport=udp",       
                "turn:tk-turn2.xirsys.com:3478?transport=udp",       
                "turn:tk-turn2.xirsys.com:80?transport=tcp",       
                "turn:tk-turn2.xirsys.com:3478?transport=tcp",       
                "turns:tk-turn2.xirsys.com:443?transport=tcp",       
                "turns:tk-turn2.xirsys.com:5349?transport=tcp"   
    ]}]
};

let stompClient = null;
let conn = null;
let stream = null;
let requestSent = false;

const ringer = new Howl({
    src: simpleRing,
    // autoplay: true,
    loop: true,
    volume: 0.2,
});

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
        handleRequest(data.from, data.callType); 
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
const handleRequest = (from, callType) => {
    connectedUser = from;
    store.dispatch({type: actionTypes.ON_INCOMING_CALL, callType, caller: from});
    ringer.play();
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
        audio: {
            autoGainControl: false,
            channelCount: 2,
            echoCancellation: false,
            latency: 0,
            noiseSuppression: false,
            sampleRate: 48000,
            sampleSize: 16,
            volume: 1.0
        }
      });
}

export const callUser = (user, type) => {
    connectedUser = user;
    config.type = type;
    console.log('calling ' + user + '....' );
    store.dispatch({type: actionTypes.CALL_INIT, callType: type})
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
    if (isInit){
        send({
            type: 'requestToCall',
            callType: config.type,
            from: currentUsername,
            to: connectedUser
        })
        requestSent = true;
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

function handleOffer(offer) {
    console.log('Accepting offer from ' + connectedUser);
    conn.setRemoteDescription(new RTCSessionDescription(offer));
    //create an answer to an offer 
    console.log('Creating and sending answer to ' + connectedUser);
    conn.createAnswer(answer => {
        answer.sdp = answer.sdp.replace('useinbandfec=1', 'useinbandfec=1; stereo=1; maxaveragebitrate=510000');
        send({ 
            type: "answer", 
            answer: answer,
            from: currentUsername,
            to: connectedUser
       });
        conn.setLocalDescription(answer);
        
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
        ringer.stop();
        dispatch({type: actionTypes.CALL_ACCEPTED})
    }
}
export const callRejected = caller => {
    send({
        type: 'rejection',
        by: currentUsername,
        to: connectedUser
    })
    ringer.stop();
    stream && stream.getTracks().forEach(track => track.stop());
    return dispatch => {
        dispatch({type: actionTypes.CALL_REJECTED})
    }
}

const handleCallRejection = data => {
    store.dispatch({type: actionTypes.CALL_REJECTED})
}
function handleAnswer(answer, name) { 
    console.log('Accepting answer from ' + name);
    conn.setRemoteDescription(new RTCSessionDescription(answer));
    store.dispatch({type: actionTypes.CALL_ACCEPTED})
}

function handleCandidate(candidate) { 
    conn.addIceCandidate(new RTCIceCandidate(candidate)); 
};

const callEnded = () => {
    return {
        type: actionTypes.END_CALL
    }
}
export const endCall = () => {
    return (dispatch, getState) => {
        if(getState().call.callOngoing || requestSent){
            send({ 
                type: "leave",
                to: connectedUser 
             });
            requestSent = false;
        } 
        handleLeave(); 
    }
}

function handleLeave() { 
    connectedUser = null;
    stream && stream.getTracks().forEach(track => track.stop());
    store.dispatch(callEnded());
    ringer.stop();
    store.dispatch(prepareCaller())
    if(conn){
        conn.close();
        conn.onicecandidate = null; 
        conn.onaddTrack = null;
    }
 };