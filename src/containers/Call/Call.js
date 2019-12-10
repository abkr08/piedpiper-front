import React, { Component} from 'react';
import swal from 'sweetalert2';
import classes from './Call.module.css';
import { connect } from 'react-redux';
import * as callActionCreators from '../../store/actions/actionIndex'
import { getSVG } from '../../shared/utility';


class Call extends Component {
    
    state = {
          id: null,
          room: null,
          isPlaying: false
    }
       
    componentDidMount (){
        if (this.props.role === 'callee'){
            this.setState({room: this.props.caller});
        } else {
            this.props.callUser(this.props.callTo, this.props.callType);
            this.setState({room: this.props.callTo});
        }
        this.props.channel.on('message', data => {
            if (JSON.parse(data).type === 'leave'){
                if (!this.props.role){
                    this.props.closeModal();
                }
            }
        })
    }
       
    
    endCall = () => {
        this.setState({room: null});
        this.props.endCall();
        if (!this.props.role){
            this.props.closeModal();
        }
    }
    
   
    
    
    async componentDidUpdate () {
        const { 
            error, endCall, closeModal, 
            callType, localStream, 
            remoteStream 
        } = this.props;
        
        if (callType === 'video'){
            this.localVideoRef.srcObject = remoteStream ? localStream : null;
            this.remoteVideoRef.srcObject = remoteStream ? remoteStream : localStream;
            console.log(remoteStream)
        } else {
            this.localAudioRef.srcObject = localStream;
            this.remoteAudioRef.srcObject = remoteStream;
        }
        if (error){
            const confirmed = await swal.fire({
                title: error.toString(),
                icon: 'error',
                showCloseButton: true,
            });
            if (confirmed.value){
                endCall();
                closeModal();
            }
        }
    }
       
    render () { 
        const { callType, remoteStream, localStream } = this.props;
        // if(this.remoteVideoRef){console.log(this.remoteVideoRef, this.remoteVideoRef.src)};
        let call = null;
        if (callType === 'video'){
            call = (
                <React.Fragment>
                    <div className={classes.videoContainer}>
                        <video className={classes.LocalVideo} autoPlay muted  
                            ref={(lVid)=> this.localVideoRef = lVid}>
                        </video>

                        <video className={classes.RemoteVideo} autoPlay muted={!remoteStream}
                        ref={(rVid)=> this.remoteVideoRef = rVid}>
                        </video>
                    </div>
                    { (localStream || remoteStream) &&
                        <div className={classes.CallButtons}>
                            <span  onClick={this.endCall} 
                            className={classes.EndCallBtn}>
                                {getSVG('endCall', 'white', '50', '50')}
                            </span>
                            <span  onClick={this.endCall} 
                            className={classes.MuteBtn}>
                            {getSVG('microphone', 'white', '50', '50')}
                            </span>
                        </div>
                    }
                </React.Fragment>
            );
        } else {
            call = (
                <React.Fragment>
                    <audio autoPlay src={this.props.localStream} muted ref={audio => this.localAudioRef = audio} />
                    <audio autoPlay src={this.props.remoteStream} ref={audio => this.remoteAudioRef = audio} />
                </React.Fragment>
            )
        }
        return (
            <div className={classes.Call}>
                {call}
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        userId: state.auth.userId,
        channel: state.call.channel,
        remoteStream: state.call.remoteStream,
        localStream: state.call.localStream,
        incomingCall: state.call.incomingCall,
        caller: state.call.caller,
        error: state.call.error
    }
}
const mapDispatchToProps = dispatch => {
    return {
        callUser: (user, callType) => dispatch(callActionCreators.callUser(user, callType)),
        endCall: () => dispatch(callActionCreators.endCall())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Call);