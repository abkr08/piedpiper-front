import React, {Component} from 'react';
import { connect } from 'react-redux';
import classes from './ChatScreenBar.module.css';
import Modal from '../../containers/Modal/Modal';
import Call from '../../containers/Call/Call';
import OptionsDropbar from '../UI/OptionsDropbar/OptionsDropbar';


class ChatScreenBar extends Component {
    state = {
        showModal: false,
        isVideo: false,
        callType: '',
        showOptions: false,
        position: {}
    }
    
    onVideoCallInit = () => {
            this.setState({showModal: true, callType: 'video', isVideo: true});
    }

    onVoiceCallInit = () => {
        this.setState({showModal: true, isVideo: false, callType: 'audio'});
    }

    showOptions = event => {
        let pos = {...this.state.position};
        pos.x = event.clientX;
        pos.y = event.clientY;
        this.setState({showOptions: true, position: pos})
    }
    hideOptions = () => {
        this.setState({showOptions: false, position:{}})
    }
    
    endCall = () => {
        this.setState({showModal: false})
    }
    render() {
        let optionsDropbar = null;
        if (this.state.showOptions){
           optionsDropbar = (
                <OptionsDropbar hideOptions={this.hideOptions} 
                position={this.state.position} 
                show={this.state.showOptions} 
                options={[{name: 'Contact info'},
                {name: 'Select messages'},
                {name: 'Mute'},
                {name: 'Clear messages'},
                {name: 'Delete chat'}
                ]}
                />
           )
              
        }
        return (
            <div className={classes.ChatScreenBar}>
            <div>
                   <img src='https://ichef.bbci.co.uk/images/ic/720x405/p0517py6.jpg' alt=''/>
                   <span>{this.props.room.name}</span>
               </div>
               <div className={classes.FA}>
                    {  this.props.room.isPrivate &&  <React.Fragment><i onClick={this.onVideoCallInit} className="fa fa-video"></i>
                    <i onClick={this.onVoiceCallInit} className="fa fa-phone"></i>
                    </React.Fragment>
                    }
                    <i className='fa fa-ellipsis-v' onClick={this.showOptions}></i>
                    {optionsDropbar}
               </div>
               <Modal show={this.state.showModal}>
                    {this.state.callType ? 
                        <Call callTo={this.props.room.name} closeModal={this.endCall} callType={this.state.callType}/> : 
                        null
                    }
                </Modal>
            </div>
        )
    } 
}
const mapStateToProps = state => {
    return {
        callEnded: state.call.callEnded,
        callStarted: state.call.callOngoing
    }
}
 export default connect(mapStateToProps)(ChatScreenBar);