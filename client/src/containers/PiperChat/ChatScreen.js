import React, { Component } from 'react';
import { connect } from 'react-redux';
import Contact from './Contact';
import Chat from './Chat';
import classes from './ChatScreen.module.css';
import SideDrawer from '../../components/UI/SideDrawer/SideDrawer';
import ChatScreenBar from '../../components/ChatScreenBar/ChatScreenBar';
import Modal from '../Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actionCreators from '../../store/actions/actionIndex';



class ChatScreen extends Component {

    state = {
        text: '',
        showSideDrawer: false,
        contacts: []
    }
    componentDidMount () {
        this.props.chatInit();
        this.props.getCallerReady();
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

   toggleSideDrawer = () => {
        this.setState(prevState => {
            return {showSideDrawer: !prevState.showSideDrawer}});
    }

    componentDidUpdate () {
        this.scrollToBottom();
        if(this.props.chatkitUser){
            const contacts = this.props.chatkitUser.rooms.map(room => {
                console.log(room.users);
                let obj = {};
                obj.name = !room.isPrivate ? room.name :
                room.userIds.filter(name => name !== this.props.userId);
                obj.id = room.id;
                return obj;
            });
        // this.setState({contacts});
        }
    }
    render () {  
        console.log(this.state.contacts);
        let chat = <Modal show={true}>
                        <Spinner />
                    </Modal>
        if (this.props.currentRoom){
            chat = (
            <div className={classes.Chat}>
                <ChatScreenBar room={this.props.currentRoom}/>
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
        let contactsPane = null;
        if (this.props.chatkitUser){
            contactsPane = (
                <div className={classes.ContactsPane} >
                <SideDrawer show={this.state.showSideDrawer} 
                user={this.props.chatkitUser}
                />
                <div className={classes.MenuBar}>
                    <i onClick = {this.toggleSideDrawer} className="fa fa-bars"></i>
                </div>
                <h1 style={{textAlign: 'center'}}>Contacts</h1>
                {this.props.chatkitUser.rooms && this.props.chatkitUser.rooms.map(con => {
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
        unopenedMessages: state.chat.unopenedMessages
    }
}
const mapDispatchToProps = dispatch => {
    return {
        chatInit: () => dispatch(actionCreators.chatInit()),
        getCallerReady: () => dispatch(actionCreators.getCallerReady()),
        getMessages: room => dispatch(actionCreators.getMessages(room)),
        sendMessage: data => dispatch(actionCreators.sendMessage(data))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);