import React, { useState } from 'react';
import { connect } from 'react-redux';

import { formatDate } from '../../shared/utility'
import * as constants from '../../shared/constants';
import * as chatActionCreators from '../../store/actions/actionIndex';

import classes from './Contact.module.css';
import OptionsDropbar from '../../components/UI/OptionsDropbar/OptionsDropbar';

const contact = props => {
    const [showOptions, toggleShowOptions] = useState(false);
    const [position, updatePosition] = useState({});
    const { room, Active, unopenedMessages, clicked, user, deleteChat } = props;
    const { roomType, displayImage, name, createdAt, updatedAt, roomId, lastMessageAt, memebers } = room;
    
    const showOptionsHandler = event => {
        event.stopPropagation();
        let pos = {};
        pos.x = event.clientX + 155;
        pos.y = event.clientY;
        toggleShowOptions(true);
        updatePosition(pos)
    }

    const hideOptions = () => {
        toggleShowOptions(false);
        updatePosition({})
    }

    const exitRoom = () => {
        debugger;
        deleteChat(roomId);
    }

    let attachedClasses = [classes.Contact];
    
    if (Active){
        attachedClasses.push(classes.Active); 
    }
    let contact = null;
    const isPrivate = roomType === constants.PRIVATE;
    let otherUser = null;
    if (room){
        if(isPrivate){
            otherUser = room.members.filter(mem => mem.username != user.username)[0];
        }
        contact = (
            <div className={attachedClasses.join(' ')} onClick={clicked}>
                <div className={classes.ImageContainter}>
                    <img src={ isPrivate ?  otherUser.profile.displayImage: displayImage } alt=''/>
                </div>
                <div className={classes.ContactDetails}>
                    <div className={classes.FloatedLeft}>
                        <span>{ isPrivate ? otherUser.username : name }</span>
                        {/* { lastMessage && 
                            <span className={classes.LastMessage}>
                                {
                                    (!isPrivate && user.userId !== lastMessage.senderId) ? 
                                        `${lastMessage.sender}: ${lastMessage.text}` 
                                            : lastMessage.text 
                                }
                            </span> 
                        } */}
                    </div>
                    <div className={classes.FloatedRight}>
                        <span className={classes.LastUpdated}>{updatedAt ? formatDate(updatedAt) : formatDate(createdAt)}</span>
                        <div className={classes.UnreadMessagesContainer}>
                            { (unopenedMessages && unopenedMessages.length) && 
                                <span className={classes.UnreadMessages}>
                                    {unopenedMessages.length}
                                </span> 
                            }
                            <i onClick={showOptionsHandler} className="fa fa-angle-down"></i>
                            { showOptions && 
                                <OptionsDropbar position={position} 
                                roomId={roomId}
                                show={showOptions} 
                                topOffset={0}
                                leftOffset={-155}
                                hideOptions={hideOptions}
                                options={[
                                    {name: 'Archive chat', clickHandler: null},
                                    {name: 'Mute', clickHandler: null},
                                    {name: !isPrivate ? 'Exit group':'Delete chat', clickHandler: exitRoom},
                                    {name: 'Pin chat', clickHandler: null},
                                    {name: 'Mark as unread', clickHandler: null}
                                ]}
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return contact; 
}
const mapStateToProps = state => {
    return {
         userId: state.auth.userId
    }
}
const mapDispatchToProps = dispatch => ({
    deleteChat: roomId => dispatch(chatActionCreators.deleteChat(roomId))
})

export default connect(mapStateToProps, mapDispatchToProps)(contact);