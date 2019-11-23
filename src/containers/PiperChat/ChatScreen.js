import React, { Component } from 'react';
import { connect } from 'react-redux';
import Contact from './Contact';
import Chat from './Chat';
import classes from './ChatScreen.module.css';
import Profile from '../../components/Profile/Profile';
import ChatScreenBar from '../../components/ChatScreenBar/ChatScreenBar';
import Modal from '../Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actionCreators from '../../store/actions/actionIndex';
import OptionsDropbar from '../../components/UI/OptionsDropbar/OptionsDropbar';

import placeholderImage from '../../assets/images/p37605.png'

class ChatScreen extends Component {

    state = {
        text: '',
        showProfile: false,
        contacts: [], 
        position: {},
        showOptions: false,
    }
    componentDidMount () {
        this.props.chatInit();
        this.scrollToBottom();
    }
    scrollToBottom = () => {
       if (this.scrollRef && this.props.messages.length > 0){
        let lastElement = this.scrollRef.children[this.scrollRef.children.length-1];
        lastElement.scrollIntoView();
        console.log(lastElement);
    }
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
            roomId: this.props.currentRoom.id
        }
        this.props.sendMessage(data);
        this.setState({text: ''});
    }

   toggleProfile = () => {
        this.setState(prevState => {
            return {showProfile: !prevState.showProfile}});
    }

    componentDidUpdate () {
        this.scrollToBottom();
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
        let chat = <Modal show={true}>
                        <Spinner />
                    </Modal>
        if (this.props.currentRoom){
            chat = (
            <div className={classes.Chat}>
                <ChatScreenBar room={this.props.currentRoom} endCall={this.props.endCall}/>
                <div className={classes.Msgs} ref={(div) => {this.scrollRef = div}}>
                {
                    this.props.messages.map(msg => {
                        return (
                            <Chat sender={msg.senderId} byCurrentUser={this.props.userId === msg.senderId}
                            text={msg.text} key={msg.id} />
                        )

                    })
                }
                </div>
           
            <form onSubmit={this.onSubmit}>
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
                showProfile={this.toggleProfile}
                options={
                    [
                        {name: 'New group'},
                        {name: 'Profile'},
                        {name: 'Log out'},
                    ]
                }
                />
            )
        }
        let contactsPane = null;
        if (this.props.chatkitUser){
            contactsPane = (
                <div className={classes.ContactsPane} >
                <Profile show={this.state.showProfile}
                hideProfile={this.toggleProfile}
                user={this.props.chatkitUser}
                />
                <div className={classes.MenuBar}>
                    <span onClick={this.toggleProfile}
                    className={classes.MenuImageContainer}
                    >
                        <img src={placeholderImage} alt='' />
                    </span>
                    <i className='fa fa-ellipsis-v' onClick={this.showOptions}></i>
                    {optionsDropbar}
                </div>
                <h1 style={{textAlign: 'center'}}>Contacts</h1>
                {this.props.contacts.length && this.props.contacts.map(con => {
                    return <Contact key={con.id} name={con.name} 
                                room={con}
                                user={this.props.userId}
                                unopenedMessages={this.props.unopenedMessages}
                                Active={this.props.currentRoom ? 
                                    con.id === this.props.currentRoom.id : 
                                    false } 
                                clicked={() => this.getMessages(con)}
                            />
                })}
                </div>
            );
            
        }
        return (
            <div className={classes.ChatScreen}>
                {contactsPane}
                {chat}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        userId: state.auth.userId,
        channel: state.call.channel,
        chatkitUser: state.chat.currentUser,
        currentRoom: state.chat.currentRoom,
        messages: state.chat.messages,
        endCall: state.call.endCall,
        unopenedMessages: state.chat.unopenedMessages,
        contacts: state.chat.contacts
    }
}
const mapDispatchToProps = dispatch => {
    return {
        chatInit: () => dispatch(actionCreators.chatInit()),
        getMessages: room => dispatch(actionCreators.getMessages(room)),
        sendMessage: data => dispatch(actionCreators.sendMessage(data))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);