import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Contact from './Contact';
import NoContacts from '../../components/NoContacts/NoContacts'
import Chat from './Chat';
import classes from './ChatScreen.module.css';
import Profile from '../../components/Profile/Profile';
import ChatScreenBar from '../../components/ChatScreenBar/ChatScreenBar';
import Modal from '../Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actionCreators from '../../store/actions/actionIndex';
import OptionsDropbar from '../../components/UI/OptionsDropbar/OptionsDropbar';
import Search from '../../components/Search/Search';
import RoomInfo from '../../components/RoomInfo/RoomInfo';

import * as constants from '../../shared/constants';
import { getSVG } from '../../shared/utility';

class ChatScreen extends Component {

    state = {
        text: '',
        showProfile: false,
        contacts: [], 
        position: {},
        showOptions: false,
        showRoomDetails: false,
        room: null,
        clientWidth: 0,
    }
    componentDidMount () {
        const { stompClient, initializeWebSocketConnection } = this.props;
        if(!stompClient){
            initializeWebSocketConnection();
        }
        this.scrollToBottom();
    }
    scrollToBottom = () => {
       if (this.scrollRef && this.props.messages.length > 0){
        let lastElement = this.scrollRef.children[this.scrollRef.children.length-1];
        lastElement.scrollIntoView();
        }
    }

    toggleShowRoomDetails = (e, room) => {
        this.setState(prevState => {
            return {
                showRoomDetails: !prevState.showRoomDetails, room  
            }
        })
    }

    getMessages = room => { 
        this.props.getMessages(room);
        this.scrollToBottom();
    }

    onChange = event => {
        this.setState({text: event.target.value});
    }
    onSubmit = event => {
        event.preventDefault();
        let data = {
            text: this.state.text,
            roomId: this.props.currentRoom.roomId,
            sender: this.props.user.username
        }
        this.props.sendMessageUsingSocket(data)
        this.setState({text: ''});
    }

   toggleProfile = () => {
        this.setState(prevState => {
            return {showProfile: !prevState.showProfile, showOptions: false}});
    }

    componentDidUpdate () {
        const { showRoomDetails, clientWidth } = this.state;
        const { currentRoom } = this.props;
        
        this.scrollToBottom();

        if(currentRoom && this.chatContainer){
            window.onresize = () => {
                const { clientWidth } = this.chatContainer;
                this.setState({ clientWidth });
            }
        }
        
        if(showRoomDetails && clientWidth == 0){
            this.setState({clientWidth: this.chatContainer.clientWidth})
        }
    }

    componentWillUnmount(){
        window.onresize = null;
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

    render () {
        const { currentRoom, endCall, user, messages, unopenedMessages, history } = this.props;
        const { room, showRoomDetails, clientWidth } = this.state;
        let chat = <Modal show={true}>
                        <Spinner />
                    </Modal>
        if (currentRoom){
            chat = (
                <div className={classes.Chat} ref={div => this.chatContainer = div}>
                    <div 
                    className={classes.BackgroundImage}
                    style={showRoomDetails ? {width: clientWidth} : null}
                    />
                    <ChatScreenBar room={this.props.currentRoom} endCall={endCall} showRoomInfo={this.toggleShowRoomDetails}/>
                    <div className={classes.Msgs} ref={(div) => {this.scrollRef = div}}>
                        {
                            messages.length && messages.map(msg => {
                                return (
                                    <Chat 
                                    sender={msg.sender} 
                                    byCurrentUser={user.username === msg.sender}
                                    text={msg.text} key={msg.id}
                                    isPrivate={currentRoom.roomType === constants.PRIVATE}
                                    time={msg.createdAt}
                                    />
                                )

                            })
                        }
                    </div>
                    {/*currentRoom.customData.customMessage && (
                        <>
                        <span className={classes.CustomMessage}>
                            {currentRoom.customData.customMessage}
                        </span>
                        { <button>Delete Room</button> }
                        </>
                    )*/}
                    <form onSubmit={this.onSubmit} style={showRoomDetails ? {width: clientWidth} : null}>
                        <input onChange={this.onChange} value={this.state.text} name='text' type="text" placeholder="Enter message" />
                    </form>
                </div>
            );
        } else {
            chat = (
                <div className={classes.Chat}></div>
            );
        }
        let optionsDropbar = null;
        if (this.state.showOptions){
            optionsDropbar = (
                <OptionsDropbar hideOptions={this.hideOptions} 
                position={this.state.position} 
                show={this.state.showOptions}
                topOffset={0}
                leftOffset={0}
                showProfile={this.toggleProfile}
                options={
                    [
                        {name: 'New group', clickHandler: null },
                        {name: 'Profile', clickHandler: this.toggleProfile},
                        {name: 'Log out', clickHandler: () => history.push('/logout')},
                    ]
                }
                />
            )
        }
        let contactsPane = (
            <Modal show={true}>
                <Spinner />
            </Modal>
        );
        if (this.props.user){
            contactsPane = (
                <div className={classes.ContactsPane}>
                <Profile show={this.state.showProfile}
                hideProfile={this.toggleProfile}
                user={this.props.user}
                style={{width: '100%'}}
                />
                <div className={classes.MenuBar}>
                    <span onClick={this.toggleProfile}
                    className={classes.MenuImageContainer}
                    >
                        <img src={this.props.user.profile.displayImage} alt='' />
                    </span>
                    <span onClick={this.showOptions}>
                    {getSVG('ellipsis', '#263238', '24', '24')}
                    </span>
                    {optionsDropbar}
                </div>
                <Search />
                {
                    user.rooms ? user.rooms.map(room => {
                        return <Contact key={room.roomId} name={room.name} 
                                    room={room}
                                    user={this.props.user}
                                    unopenedMessages={unopenedMessages[room.roomId]}
                                    Active={ currentRoom ? 
                                        room.roomId === currentRoom.roomId : 
                                        false } 
                                    clicked={() => this.getMessages(room)}
                                />
                    }) : (
                        <NoContacts />
                    )
                }
                </div>
            );
            
        }
        let roomInfo = null
        if(showRoomDetails){
           roomInfo = (
               <div className={classes.RoomInfo}>
                   <RoomInfo 
                    room={room}
                    username={user.username}
                    toggleShowRoomDetails={this.toggleShowRoomDetails}
                    />
               </div>
           ) 
        }
        return (
            <div className={classes.ChatScreen}>
                {contactsPane}
                {chat}
                {roomInfo}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.auth.user,
        channel: state.call.channel,
        currentRoom: state.chat.currentRoom,
        messages: state.chat.messages,
        endCall: state.call.endCall,
        unopenedMessages: state.chat.unopenedMessages,
        contacts: state.chat.contacts,
        stompClient: state.chat.stompClient
    }
}
const mapDispatchToProps = dispatch => {
    return {
        chatInit: () => dispatch(actionCreators.chatInit()),
        initializeWebSocketConnection: () => dispatch(actionCreators.initializeWebSocketConnection()),
        sendMessageUsingSocket: message => dispatch(actionCreators.sendMessageUsingSocket(message)),
        getMessages: room => dispatch(actionCreators.getMessages(room)),
        sendMessage: data => dispatch(actionCreators.sendMessage(data))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatScreen));