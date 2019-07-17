import pusher from '../../../pusherConfig';
import * as actionTypes from '../actions';
import { store }  from '../../../index';

const servers = null;
const channel = pusher.subscribe('presence-videocall');
const caller = new window.RTCPeerConnection(servers);
const userId = localStorage.getItem('userId');

const config = {}

caller.onicecandidate = evt => {
    if (!evt.candidate) return;
    // alert('candidate')
    onIceCandidate(caller, evt);
  };
  caller.ontrack = evt => {
    console.log(`${userId} received remote stream`);
    store.dispatch(onTrack(evt));
};

//setInterval(()=> console.log(caller.signalingState), 4000);
channel.bind("pusher:subscription_succeeded", members => {
     
    //this.setState({id: this.props.channel.members.me.id, room: this.props.callTo});
    
  });

channel.bind("pusher:member_added", member => {
    console.log(member);
  });

channel.bind("pusher:member_removed", member => {
    if (member.id === config.room) {
    //   alert('call Ended');
    }
    
});
channel.bind("client-candidate", msg => {
    if (msg.room === config.room) {
        let candidate = new RTCIceCandidate(msg.candidate);
        console.log(candidate);
    //   addIceCandidate(candidate);
      caller.addIceCandidate(candidate)
      .then(() => onAddIceCandidateSuccess(msg.room), err => onAddIceCandidateError(msg.room, err));
    console.log(`${msg.room} ICE candidate:\n${msg.candidate ? msg.candidate.candidate : '(null)'}`);
    }
});
function onAddIceCandidateSuccess() {
    console.log(`${userId} addIceCandidate success`);
  }
  
  function onAddIceCandidateError(error) {
    console.log(`${userId} failed to add ICE Candidate: ${error.toString()}`);
  }
channel.bind("client-sdp", msg => {
    if (msg.room === userId) {
        store.dispatch({type: actionTypes.ON_INCOMING_CALL, callType: msg.callType, caller: msg.from});
        config.room = msg.room;
        config.sdp = msg.sdp;
        config.state = 'answerCall';
        }
});

    channel.bind("client-answer", answer => {
        if (answer.room === config.room) {
            // let sessionDesc = new RTCSessionDescription(answer.sdp);
            // setRemoteDescription(sessionDesc);
            console.log('pc1 setRemoteDescription start');
            caller.setRemoteDescription(new RTCSessionDescription(answer.sdp)).then(() => onSetRemoteSuccess(), onSetSessionDescriptionError);
  
        }
        });
    
export const callAccepted = () => {
    return dispatch => {
        config.state = 'answerCall';
        getMedia().then(gotStream)
        .catch(e => alert(`getUserMedia() error: ${e.name}`));
        dispatch({type: actionTypes.CALL_INIT})
        dispatch({type: actionTypes.CALL_ACCEPTED})
        // let sessionDesc = new RTCSessionDescription(config.sdp);
        // setRemoteDescription(sessionDesc);
        // getCam();
        console.log(`${userId} setRemoteDescription start`);
        caller.setRemoteDescription(new RTCSessionDescription(config.sdp)).then(() => onSetRemoteSuccess(), onSetSessionDescriptionError);
        console.log(`${userId} createAnswer start`);
        // Since the 'remote' side has no media stream we need
        // to pass in the right constraints in order for it to
        // accept the incoming offer of audio and video.
        caller.createAnswer().then(onCreateAnswerSuccess, onCreateSessionDescriptionError);
        getMedia().then(gotStream)
        .catch(e => alert(`getUserMedia() error: ${e.name}`));
        dispatch({type: actionTypes.CALL_INIT})
        dispatch({type: actionTypes.CALL_ACCEPTED})
    }
}

const onCreateAnswerSuccess = desc => {
    console.log(`Answer from ${userId}:\n${desc.sdp}`);
    console.log(`${userId} setLocalDescription start`);
    caller.setLocalDescription(desc).then(() => onSetLocalSuccess(), onSetSessionDescriptionError);
    
    channel.trigger("client-answer", {
        sdp: desc,
        room: config.room
    });
}

function onSetLocalSuccess() {
    console.log(`${userId} setLocalDescription complete`);
  }
  
  function onSetRemoteSuccess() {
    console.log(`${userId} setRemoteDescription complete`);
  }
  function onCreateSessionDescriptionError(error) {
    console.log(`Failed to create session description: ${error.toString()}`);
  }
  function onSetSessionDescriptionError(error) {
    console.log(`Failed to set session description: ${error.toString()}`);
  }
export const callRejected = () => {
    return dispatch => {
        channel.trigger("client-reject", { room: config.room, rejected: userId });
        dispatch({type: actionTypes.CALL_REJECTED})
    }
}
const onLocalStream = stream => {
    return {
        type: actionTypes.ON_LOCAL_STREAM,
        stream: stream
    }
}
//Create and send offer to remote peer on button click
export const callUser = (user, type) => {
    config.room = user;
    config.callType = type;
    config.state = 'makeCall';
    config.initiator = true;
    console.log('Requesting local stream');
    return dispatch => {
        // getCam();
        getMedia().then(gotStream)
        .catch(e => alert(`getUserMedia() error: ${e.name}`));
        dispatch({type: actionTypes.CALL_INIT})

        let offerOptions = {offerToReceiveVideo: true, offerToReceiveAudio: true}
        caller.createOffer(offerOptions).then(onCreateOfferSuccess, onCreateSessionDescriptionError);
    }
  }  
const  onCreateOfferSuccess = desc =>  {
    console.log(`Offer from ${userId}\n${desc.sdp}`);
    console.log(`${userId} setLocalDescription start`);
    caller.setLocalDescription(desc).then(() => onSetLocalSuccess(), onSetSessionDescriptionError);
    channel.trigger("client-sdp", {
        sdp: desc,
        room: config.room,
        from: userId,
        callType: config.callType
    });
}
  
const gotStream = stream => {
    console.log('Received local stream');
    store.dispatch(onLocalStream(stream));
        stream.getTracks().forEach(track => {
            caller.addTrack(track, stream)
        });
}
const getCam = () => {
    // alert('line 86--' + room);
    getMedia().then(stream => {
        store.dispatch(onLocalStream(stream));
        stream.getTracks().forEach(track => {
            caller.addTrack(track, stream)
        });    
            if (config.state === 'makeCall'){
                createOffer();
            } else {
        // let sessionDesc = new RTCSessionDescription(config.sdp);
        // setRemoteDescription(sessionDesc);
        createAnswer();
        config.state = null;
            }
        })
        .catch(error => {
          console.log("an error occured", error);
        });
}

const getMedia = () => {
    return navigator.mediaDevices.getUserMedia({
        video: config.callType === 'video' ? {width: 1280,
            height: 720,
            frameRate: 15}: false,
        audio: true
      });
}
const prepareCaller = channel => {
    return {
        type: actionTypes.PREPARE_CALLER,
        channel: channel
    }
}

export const getCallerReady = () => {
    return dispatch => {
     dispatch(prepareCaller(channel));
    }
}
const onTrack = track => {
    return {
        type: actionTypes.ON_TRACK,
        remoteStream: track.streams[0]
    }
}

const onIceCandidate = (peer, evt) => {
    if (evt.candidate) {   
      channel.trigger("client-candidate", {
        candidate: evt.candidate,
        room: config.room
      });
    }
  }


const setLocalDescription = sessionDesc => {
    return caller.setLocalDescription(sessionDesc);
}

const setRemoteDescription = sessionDesc => {
    return caller.setRemoteDescription(sessionDesc);
}

const addTrack = (track, stream) => {
  caller.addTrack(track, stream);
}

const createAnswer = () => {
    // alert('createAnswer room: ' + receiver);
    caller.createAnswer().then(sdp => {
        let sessionDesc = new RTCSessionDescription(sdp);
        setLocalDescription(sessionDesc);
        channel.trigger("client-answer", {
            sdp: sdp,
            room: config.room
        });
        console.log(caller.signalingState);
    });;
}

const createOffer = () => {    
    // alert('createOffer room--180: ' + room)    
    caller.createOffer({offerToReceiveVideo: true, offerToReceiveAudio: true}).then(desc => {
        let sessionDesc = new RTCSessionDescription(desc);
        setLocalDescription(sessionDesc);
        // console.log(config);
        // alert('createOffer room--184: ' + config.room) 
        channel.trigger("client-sdp", {
            sdp: desc,
            room: config.room,
            from: userId,
            callType: config.callType
        });
        console.log(caller.signalingState);
    })
    .catch(err => console.log(err));
}
export const endCall = () => {
    return dispatch => {
        dispatch({type: actionTypes.END_CALL});
    }
    
}

// setInterval(() => {
//     console.log(caller.signalingState);
// }, 3000);