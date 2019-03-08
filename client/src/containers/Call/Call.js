import React, { Component} from 'react';
import classes from './Call.module.css';
import { connect } from 'react-redux';
import * as callActionCreators from '../../store/actions/actionIndex'

class Call extends Component {
    
    state = {
          id: null,
          room: ''
    }
       
    componentDidMount (){
        
        this.props.callUser(this.props.callTo, this.props.callType);
        alert(this.props.callType);
        this.props.channel.bind("client-reject", answer => {
            if (answer.room === this.state.room) {
              console.log("Call declined");
              alert("call to " + answer.rejected + "was politely declined");
              this.endCall();
            }
          });
      
          this.props.channel.bind("client-endcall", answer =>  {
            if (answer.room === this.state.room) {
              console.log("Call Ended");
              this.endCall();
            }
          });
          
    }
       
    
     endCall = () => {
          this.setState({room: undefined});
          ///this.props.closeCaller.close();
          for (let track of this.localUserMedia.getTracks()) {
            track.stop();
          }
        
          this.toggleEndCallButton();
        }
    
       endCurrentCall = () => {
          this.props.channel.trigger("client-endcall", {
            room: this.state.room
          });
    
          this.endCall();
        }
    
    
         toggleEndCallButton = () => {
        /*  if (document.getElementById("endCall").style.display === "block") {
            document.getElementById("endCall").style.display = "none";
          } else {
            document.getElementById("endCall").style.display = "block";
          }*/
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
                    <video autoPlay muted src={this.props.localStream} 
                        className={classes.LocalVideo} 
                        ref={(lVid)=> this.localVideoRef = lVid}>
                    </video>
                    <video autoPlay  src={this.props.remoteStream} 
                        className={classes.remoteVideo} 
                        ref={(rVid)=> this.remoteVideoRef = rVid}>
                    </video>
                </React.Fragment>
            );
        } else {
            call = (
                <React.Fragment>
                    <audio autoPlay src={this.props.localStream} ref={audio => this.localAudioRef = audio} />
                    <audio autoPlay src={this.props.remoteStream} ref={audio => this.remoteAudioRef = audio} />
                </React.Fragment>
            )
        }
        return (
            <div className={classes.Call}>{call}</div>
        )
    }
}
const mapStateToProps = state => {
    return {
        userId: state.auth.userId,
        channel: state.call.channel,
        remoteStream: state.call.remoteStream,
        localStream: state.call.localStream
    }
}
const mapDispatchToProps = dispatch => {
    return {
        callUser: (user, callType) => dispatch(callActionCreators.callUser(user, callType))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Call);