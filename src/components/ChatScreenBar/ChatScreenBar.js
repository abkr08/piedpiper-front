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
                <div className={classes.FloatedRight}>
                   <img src={this.props.room.customData.displayImage} alt=''/>
                   <span className={classes.RoomDetails}>
                    <span className={classes.RoomName}>{this.props.room.name}</span>
                    { this.props.room.isPrivate &&
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
                        <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 16 20" width="24" height="28">
                            <path fill="#263238" fillOpacity=".4" d="M15.243 5.868l-3.48 3.091v-2.27c0-.657-.532-1.189-1.189-1.189H1.945c-.657 0-1.189.532-1.189 1.189v7.138c0 .657.532 1.189 1.189 1.189h8.629c.657 0 1.189-.532 1.189-1.189v-2.299l3.48 3.09v-8.75z" />
                        </svg>
                        </span>
                        <span onClick={this.onVoiceCallInit}>
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -256 1792 1792"
                            id="svg3013"
                            version="1.1"
                            width="24"
                            height="24">
                                <path
                                transform="matrix(1,0,0,-1,159.45763,1293.0169)"
                                d="m 1408,296 q 0,-27 -10,-70.5 Q 1388,182 1377,157 1356,107 1255,51 1161,0 1069,0 1042,0 1016.5,3.5 991,7 959,16 927,25 911.5,30.5 896,36 856,51 816,66 807,69 709,104 632,152 504,231 367.5,367.5 231,504 152,632 104,709 69,807 66,816 51,856 36,896 30.5,911.5 25,927 16,959 7,991 3.5,1016.5 0,1042 0,1069 q 0,92 51,186 56,101 106,122 25,11 68.5,21 43.5,10 70.5,10 14,0 21,-3 18,-6 53,-76 11,-19 30,-54 19,-35 35,-63.5 16,-28.5 31,-53.5 3,-4 17.5,-25 14.5,-21 21.5,-35.5 7,-14.5 7,-28.5 0,-20 -28.5,-50 -28.5,-30 -62,-55 -33.5,-25 -62,-53 -28.5,-28 -28.5,-46 0,-9 5,-22.5 5,-13.5 8.5,-20.5 3.5,-7 14,-24 10.5,-17 11.5,-19 76,-137 174,-235 98,-98 235,-174 2,-1 19,-11.5 17,-10.5 24,-14 7,-3.5 20.5,-8.5 13.5,-5 22.5,-5 18,0 46,28.5 28,28.5 53,62 25,33.5 55,62 30,28.5 50,28.5 14,0 28.5,-7 14.5,-7 35.5,-21.5 21,-14.5 25,-17.5 25,-15 53.5,-31 28.5,-16 63.5,-35 35,-19 54,-30 70,-35 76,-53 3,-7 3,-21 z"
                                id="path3017"
                                fill="#263238" fillOpacity=".4"
                                />
                            </svg>
                        </span>
                    </>
                    }
                    <span onClick={this.showOptions}>
                    <svg id="Layer_1" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" width="24" 
                    height="24">
                        <path fill="#263238" 
                        fillOpacity=".6" d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z">
                        </path>
                    </svg>
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