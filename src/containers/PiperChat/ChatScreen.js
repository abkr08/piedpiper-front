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
import Button from '../../components/UI/Button/Button';
import Search from '../../components/Search/Search';
import RoomInfo from '../../components/RoomInfo/RoomInfo';
import swal from 'sweetalert2';

import * as constants from '../../shared/constants';
import { getSVG } from '../../shared/utility';

class ChatScreen extends Component {

    state = {
        text: '',
        showProfile: false,
        rooms: this.props.rooms || [], 
        position: {},
        showOptions: false,
        showRoomDetails: false,
        room: null,
        clientWidth: 0,
        searchString: '',
        contactsLoading: true,
        searchingContact: false
    }
    componentDidMount () {
        const { stompClient, initializeWebSocketConnection } = this.props;
        if(!stompClient){
            initializeWebSocketConnection();
        }
        this.scrollToBottom();
        this.updated = false;
        this.setState({ contactsLoading: false })
    }
    scrollToBottom = () => {
        const { currentRoom, messages } = this.props;
       if (this.scrollRef && messages[currentRoom.roomId] && messages[currentRoom.roomId].length > 0){
        let lastElement = this.scrollRef.children[this.scrollRef.children.length-1];
        lastElement.scrollIntoView();
        }
    }

    acceptChatRequest = () => {
        const { acceptChatRequest, currentRoom } = this.props;
        acceptChatRequest(currentRoom);
    }

    denyChatRequest = () => {
        const { denyChatRequest, currentRoom } = this.props;
        denyChatRequest(currentRoom);
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
        this.props.sendMessage(data)
        this.setState({text: ''});
    }

   toggleProfile = () => {
        this.setState(prevState => {
            return {showProfile: !prevState.showProfile, showOptions: false}});
    }

    onSearch = text => {
        const { rooms } = this.props.user;
        this.setState({ searchString: text })
        // if (rooms.length && text.length){
        //     const regex = new RegExp(`^${text}`, 'i');
        //     let suggestions = rooms.sort().filter(room => regex.test(room.name));
        //     this.setState({ rooms: suggestions, searchString: text })
        // } else if (text.length){
        //     this.setState({ searchString: text })
        // } else {
        //     this.setState({ rooms: rooms, searchString: '' })
        // }
    }

    // shouldComponentUpdate(){
    //     return this.props.rooms != this.state.rooms;
    // }

    onSearchSubmitted = () => {
        this.setState({ searchingContact: true })
        const { searchString } = this.state;
        let data = { chatParticipant: searchString.toLowerCase() };
        this.props.onStartNewChat(data);
    }

    async componentDidUpdate () {
        const { showRoomDetails, clientWidth } = this.state;
        const { currentRoom, startNewChatError, resetFields, rooms, contactSearchSuccessful } = this.props;
        
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

        if(!this.updated && contactSearchSuccessful){
            this.updated = true;
            this.setState({ searchString: '', searchingContact: false, rooms }, () => {
                const fields = ['contactSearchSuccessful']
                resetFields(fields);
                this.updated = false;
            });
            
        }

        if(!this.updated && startNewChatError){
            this.updated = true;
            const { error } = startNewChatError;
            this.setState({ searchingContact: false })
            const result = await swal.fire({
                title: error,
                icon: 'error',
                showCloseButton: true,
                focusConfirm: false,
                confirmButtonText: 'Close'
            })
            if (result){
                this.setState({ searchString: '', rooms });
                const fields = ['startNewChatError']
                resetFields(fields);
                this.updated = false;
            }
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
        const { currentRoom, endCall, user, messages, unopenedMessages, history, rooms } = this.props;
        const { room, showRoomDetails, clientWidth, searchString, searchingContact } = this.state;
        let filteredRooms = rooms;
        if(searchString.length !== 0){
            const regex = new RegExp(`^${searchString}`, 'i');
            filteredRooms = rooms.sort().filter(rm => regex.test(rm.name));
        }
        
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
                    <ChatScreenBar room={currentRoom} endCall={endCall} showRoomInfo={this.toggleShowRoomDetails}/>
                    <div className={classes.Msgs} ref={(div) => {this.scrollRef = div}}>
                        {
                            messages[currentRoom.roomId] && messages[currentRoom.roomId].length ? messages[currentRoom.roomId].map(msg => {
                                return (
                                    <Chat 
                                    sender={msg.sender} 
                                    byCurrentUser={user.username === msg.sender}
                                    text={msg.text} key={msg.id}
                                    isPrivate={currentRoom.roomType === constants.PRIVATE}
                                    time={msg.createdAt}
                                    />
                                )
                            }) : null
                        }
                    </div>
                    { currentRoom.isARequest && (
                         currentRoom.createdBy == user.username ? (
                        <span className={classes.CustomMessage}>
                            You can't send a message to this room yet. Wait for the other user to accept your chat request.
                        </span>
                        ) : (
                            <>
                                <button className={classes.AcceptRequest} onClick={this.acceptChatRequest}>
                                    Accept
                                </button>
                                <button className={classes.DenyRequest} onClick={this.denyChatRequest}>
                                    Decline
                                </button>
                            </>
                        )
                        
                       
                    )}
                    <form onSubmit={this.onSubmit} style={showRoomDetails ? {width: clientWidth} : null}>
                        <input disabled={currentRoom.isARequest} 
                        onChange={this.onChange} value={this.state.text} 
                        name='text' type="text" 
                        placeholder="Enter message" />
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
                <Search value={searchString} onSearch={this.onSearch}/>
                {
                    filteredRooms && filteredRooms.length || searchString.length ? (
                        filteredRooms.length ? rooms.map(room => {
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
                            <div className={classes.SearchContact}>
                                <h3>Contact not found</h3>
                                <span style={{display: 'flex'}}>
                                <p onClick={this.onSearchSubmitted}>Search for contact on the server? </p>
                                { searchingContact && <i className='fas fa-spinner fa-spin' /> }
                                </span>
                                
                            </div>
                        )
                    ) :
                    (
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
        rooms: state.chat.rooms,
        stompClient: state.chat.stompClient,
        startNewChatError: state.chat.startNewChatError,
        contactSearchSuccessful: state.chat.contactSearchSuccessful
    }
}
const mapDispatchToProps = dispatch => {
    return {
        initializeWebSocketConnection: () => dispatch(actionCreators.initializeWebSocketConnection()),
        sendMessage: message => dispatch(actionCreators.sendMessage(message)),
        getMessages: room => dispatch(actionCreators.getMessages(room)),
        sendMessage: data => dispatch(actionCreators.sendMessage(data)),
        onStartNewChat: data => dispatch(actionCreators.startNewChat(data)),
        acceptChatRequest: currentRoom => dispatch(actionCreators.acceptChatRequest(currentRoom)),
        denyChatRequest: currentRoom => dispatch(actionCreators.denyChatRequest(currentRoom)),
        resetFields: fields => dispatch(actionCreators.resetFields(fields))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatScreen));