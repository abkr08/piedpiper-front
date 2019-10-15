import React, { Component} from 'react';
import classes from './Call.module.css';
import { connect } from 'react-redux';
import * as callActionCreators from '../../store/actions/actionIndex'

import Button from '../../components/UI/Button/Button';

class Call extends Component {
    
    state = {
          id: null,
          room: null
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
    
   
    
    
    componentDidUpdate () {
        if (this.props.callType === 'video'){
            this.localVideoRef.srcObject = this.props.localStream;
            this.remoteVideoRef.srcObject = this.props.remoteStream;
        } else {
            this.localAudioRef.srcObject = this.props.localStream;
            this.remoteAudioRef.srcObject = this.props.remoteStream;
        }
    }
       
    render () {
        let call = null;
        if (this.props.callType === 'video'){
            call = (
                <React.Fragment>
                    <div className={classes.videoContainer}>
                        <video className={classes.LocalVideo} autoPlay muted  
                            ref={(lVid)=> this.localVideoRef = lVid}>
                        </video>

                        <video className={classes.RemoteVideo} autoPlay  
                        ref={(rVid)=> this.remoteVideoRef = rVid}>
                        </video>
                    </div>
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
                <div className={classes.Buttons}>
                    {/* <span style={{color: 'red'}}><i class="fas fa-window-close"></i></span> */}
                    <Button clicked={this.endCall} btnType='Danger'>End Call</Button>
                </div>
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
        caller: state.call.caller
    }
}
const mapDispatchToProps = dispatch => {
    return {
        callUser: (user, callType) => dispatch(callActionCreators.callUser(user, callType)),
        endCall: () => dispatch(callActionCreators.endCall())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Call);