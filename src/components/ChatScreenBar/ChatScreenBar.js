import React, {Component} from 'react';
import { connect } from 'react-redux';
import classes from './ChatScreenBar.module.css';
import Modal from '../../containers/Modal/Modal';
import Call from '../../containers/Call/Call';
import OptionsDropbar from '../UI/OptionsDropbar/OptionsDropbar';
import { getSVG } from '../../shared/utility';
import * as constants from '../../shared/constants';

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
        const { room, user, showRoomInfo } = this.props;
        let isPrivate = room.roomType == constants.PRIVATE;
        let otherUser;
        if(isPrivate){
            otherUser = room.members.filter(mem => mem.username !== user.username)[0];
        }
        let optionsDropbar = null;
        if (this.state.showOptions){
           optionsDropbar = (
                <OptionsDropbar hideOptions={this.hideOptions} 
                position={this.state.position} 
                show={this.state.showOptions}
                topOffset ={-10}
                leftOffset ={-155}
                options={[
                    {name: 'Contact info', clickHandler: null},
                    {name: 'Select messages', clickHandler: null},
                    {name: 'Mute', clickHandler: null},
                    {name: 'Clear messages', clickHandler: null},
                    {name: 'Delete chat', clickHandler: null}
                ]}
                />
           )
              
        }
        return (
            <div className={classes.ChatScreenBar}>
                <div className={classes.FloatedRight} onClick={e => showRoomInfo(e, room)}>
                   <img src={isPrivate ? otherUser.profile.displayImage : room.displayImage} alt=''/>
                   <span className={classes.RoomDetails}>
                    <span className={classes.RoomName}>{isPrivate ? otherUser.username : room.name}</span>
                    { !isPrivate &&
                        (<span className={classes.RoomMembers}>
                            {room.members.map(mem => mem.username).join(", ")}
                        </span>)
                    }
                   </span>
               </div>
               <div className={classes.FA}>
                    {  isPrivate &&  
                    <>
                        <span onClick={this.onVideoCallInit}>
                            {getSVG('video', '#263238', '28', '24')}
                        </span>
                        <span onClick={this.onVoiceCallInit}>
                            {getSVG('voice', '#263238', '24', '24')}
                        </span>
                    </>
                    }
                    <span onClick={this.showOptions}>
                        {getSVG('ellipsis', '#263238', '24', '24')}
                    </span>
                    {optionsDropbar}
                </div>
                <Modal show={this.state.showModal}>
                    {this.state.callType ? 
                        <Call callTo={otherUser.username} closeModal={this.endCall} callType={this.state.callType}/> : 
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
        callStarted: state.call.callOngoing,
        user: state.auth.user
    }
}
 export default connect(mapStateToProps)(ChatScreenBar);