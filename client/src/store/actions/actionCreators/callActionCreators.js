import pusher from '../../../pusherConfig';
import * as actionTypes from '../actions';
import { store }  from '../../../index';

const channel = pusher.subscribe('presence-videocall');
const caller = new window.RTCPeerConnection({'iceServers':[{'urls':'stun:stun.l.google.com:19302'}]});
const userId = localStorage.getItem('userId');
let room, sdp, callType;
let state = null;
//setInterval(()=> console.log(caller.signalingState), 4000);
channel.bind("pusher:subscription_succeeded", members => {
         
    //this.setState({id: this.props.channel.members.me.id, room: this.props.callTo});
    
  });

channel.bind("pusher:member_added", member => {
    console.log(member);
  });

channel.bind("pusher:member_removed", member => {
    if (member.id === room) {
      alert('call Ended');
    }
    
});
channel.bind("client-candidate", msg => {
    if (msg.room === room) {
      addIceCandidate(new RTCIceCandidate(msg.candidate));
    }
});
channel.bind("client-sdp", msg => {
    if (msg.room === userId) {
        store.dispatch({type: actionTypes.ON_INCOMING_CALL, callType: msg.callType});
        let answer = window.confirm(`You have a ${msg.callType} call from ${msg.from}: Would you like to answer?`);
        if (!answer) {
          return channel.trigger("client-reject", { room: msg.room, rejected: userId });
        } else {
        room = msg.room;
        // let sessionDesc = new RTCSessionDescription(msg.sdp);
        // setRemoteDescription(sessionDesc);
        sdp = msg.sdp;
        state = 'answerCall';
        getCam();
        }
    }
});

    channel.bind("client-answer", answer => {
        console.log(answer.room, room)
        if (answer.room === room) {
            console.log("answer received");
            let sessionDesc = new RTCSessionDescription(answer.sdp);
            setRemoteDescription(sessionDesc);
        }
        });
    
const onLocalStream = stream => {
    return {
        type: actionTypes.ON_LOCAL_STREAM,
        stream: stream
    }
}
//Create and send offer to remote peer on button click
export const callUser = (user, Type) => {
    room = user;
    callType = Type;
    return dispatch => {
        getCam();
    }
  }    
const getCam = () => {
    getMedia().then(stream => {
        store.dispatch(onLocalStream(stream));
        stream.getTracks().forEach(track => {
            caller.addTrack(track, stream)
        });    
            if (!state){
                createOffer();
            } else {
        let sessionDesc = new RTCSessionDescription(sdp);
        setRemoteDescription(sessionDesc);
        createAnswer();
            }
        })
        .catch(error => {
          console.log("an error occured", error);
        });
}

const getMedia = () => {
    return navigator.mediaDevices.getUserMedia({
        video: callType === 'video' ? {width: 160,
            height: 120,
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
    //Listen for ICE Candidates and send them to remote peers
    caller.onicecandidate = evt => {
      if (!evt.candidate) return;
      onIceCandidate(caller, evt);
    };
    //ontrack handler to receive remote feed and show in remoteview video element
    caller.ontrack = evt => {
        dispatch(onTrack(evt));
    };
    }
}
const onTrack = track => {
    return {
        type: actionTypes.ON_TRACK,
        remoteStream: track.streams[0]
    }
}
const addIceCandidate = iceCandidate => {
    return caller.addIceCandidate(iceCandidate);
}

const onIceCandidate = (peer, evt) => {
    if (evt.candidate) {   
      channel.trigger("client-candidate", {
        candidate: evt.candidate,
        room: room
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
    caller.createAnswer().then(sdp => {
        let sessionDesc = new RTCSessionDescription(sdp);
        setLocalDescription(sessionDesc);
        channel.trigger("client-answer", {
            sdp: sdp,
            room: room
        });
    });;
}

const createOffer = () => {        
    caller.createOffer({offerToReceiveVideo: true}).then(desc => {
        let sessionDesc = new RTCSessionDescription(desc);
        setLocalDescription(sessionDesc);
        channel.trigger("client-sdp", {
            sdp: desc,
            room: room,
            from: userId,
            callType: callType
        });
    })
    .catch(err => console.log(err));
}