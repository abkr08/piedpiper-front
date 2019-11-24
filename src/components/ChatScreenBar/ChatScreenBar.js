import React, {Component} from 'react';
import { connect } from 'react-redux';
import classes from './ChatScreenBar.module.css';
import Modal from '../../containers/Modal/Modal';
import Call from '../../containers/Call/Call';
import OptionsDropbar from '../UI/OptionsDropbar/OptionsDropbar';
import { getSVG } from '../../shared/utility';

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
                <div className={classes.FloatedRight}>
                   <img src={this.props.room.customData.displayImage} alt=''/>
                   <span className={classes.RoomDetails}>
                    <span className={classes.RoomName}>{this.props.room.name}</span>
                    { !this.props.room.isPrivate &&
                        (<span className={classes.RoomMembers}>
                            Ahmed, Aunty Hauwa, Aunty Lami, Hajju
                        </span>)
                    }
                   </span>
               </div>
               <div className={classes.FA}>
                    {  this.props.room.isPrivate &&  
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