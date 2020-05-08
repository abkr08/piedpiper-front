import React, { Component} from 'react';
import swal from 'sweetalert2';
import classes from './Call.module.css';
import { connect } from 'react-redux';
import * as callActionCreators from '../../store/actions/actionIndex'
import { getSVG, formatDuration } from '../../shared/utility';


class Call extends Component {
    
    state = {
          id: null,
          room: null,
          isPlaying: false, 
          callDuration: 0,
          showCallButtons: false
    }
       
    componentDidMount (){
        let { role, callUser, callTo, callType, caller } = this.props;
        if (role === 'callee'){
            this.setState({ room: caller });
        } else {
            callUser(callTo, callType);
            this.setState({room: callTo});
        }
        this.interval = null;
        // this.localVideoRef.onplaying = () => {
        //     alert('video playing!!!')
        // }
    }
       
    
    endCall = () => {
        this.setState({room: null});
        let { role, endCall, closeModal } = this.props;
        endCall();
        if (!role){
            closeModal();
        }
    }
        
    
    async componentDidUpdate () {
        const { 
            error, endCall, closeModal, 
            callType, localStream, 
            remoteStream,
            callEnded,
            callOngoing,
            resetFields
        } = this.props;
        const { callDuration } = this.state;
 
        if(!this.interval){
            if (callType === 'video'){
                this.localVideoRef.srcObject = remoteStream ? localStream : null;
                this.remoteVideoRef.srcObject = remoteStream ? remoteStream : localStream;
            } else {
                this.localAudioRef.srcObject = localStream;
                this.remoteAudioRef.srcObject = remoteStream;
            }
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
        if (callEnded){
            closeModal();
            let fields = ['callEnded'];
            resetFields(fields);
            clearInterval(this.interval);
        }

        if (callOngoing && callDuration == 0){
            this.updateTimer();
        }
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }

    updateTimer = () => {
        clearInterval(this.interval);
        this.setState(prevState => {
            return { callDuration: prevState.callDuration + 1}
        })
        this.interval = setInterval(this.updateTimer, 1000);
    }
    
    showButtons = () => {
        const { showCallButtons } = this.state;
        if(this.remoteVideoRef.readyState == 4 && !showCallButtons){
            this.setState({ showCallButtons: true })
        }
    }
    render () { 
        const { callType, remoteStream, localStream } = this.props;
        const { callDuration, showCallButtons } = this.state;
        let call = null;
        if (callType === 'video'){
            call = (
                <React.Fragment>
                    <div className={classes.videoContainer}>
                        <video className={classes.LocalVideo} autoPlay muted  
                            ref={(lVid)=> this.localVideoRef = lVid}>
                        </video>

                        <video className={classes.RemoteVideo} autoPlay muted={!remoteStream}
                        ref={(rVid)=> this.remoteVideoRef = rVid}
                        onLoadedData={this.showButtons}
                        >
                        </video>
                    </div>
                    { showCallButtons && (
                        <div className={classes.CallButtons}>
                            <span  onClick={this.endCall} 
                            className={classes.EndCallBtn}>
                                {getSVG('phone', 'white', '50', '50')}
                            </span>
                            <span  onClick={null} 
                            className={classes.MuteBtn}>
                            {getSVG('microphone', 'white', '50', '50')}
                            </span>
                            { callDuration > 0 && ( <span className={classes.Duration}>{formatDuration(callDuration)}</span> )}
                        </div>
                    )
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
        error: state.call.error,
        callEnded: state.call.callEnded,
        callOngoing: state.call.callOngoing
    }
}
const mapDispatchToProps = dispatch => {
    return {
        callUser: (user, callType) => dispatch(callActionCreators.callUser(user, callType)),
        endCall: () => dispatch(callActionCreators.endCall()),
        resetFields: fields => dispatch(callActionCreators.resetFields(fields))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Call);