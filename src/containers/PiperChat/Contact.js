import React, { useState } from 'react';
import moment from 'moment';
import classes from './Contact.module.css';
import img from '../../assets/images/p37605.png'
import { connect } from 'react-redux';
import OptionsDropbar from '../../components/UI/OptionsDropbar/OptionsDropbar';

const contact = props => {
    const [showOptions, toggleShowOptions] = useState(false);
    const [position, updatePosition] = useState({});
    // console.log(moment("2010-01-01T05:06:07").getDate().toString());
    const formatDate = date => {
        moment.updateLocale('en', {
            calendar : {
                lastDay : '[Yesterday]',
                sameDay : 'LT',
                nextDay : '[Tomorrow at] LT',
                lastWeek : 'dddd',
                nextWeek : 'dddd [at] LT',
                sameElse : 'L'
            }
        });
        return moment(date).calendar()
    }
    // console.log(formatDate("2019-11-24T05:06:07"));
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
    let attachedClasses = [classes.Contact];
    let unreadMessages = "";
    if (props.Active){
        attachedClasses.push(classes.Active); 
    }
    if (props.unopenedMessages[props.id]){
        unreadMessages = props.unopenedMessages[props.id].length;
    }
    let contact = null;
    if (props.room){
        contact = (
            <div className={attachedClasses.join(' ')} onClick={props.clicked}>
                <span className={classes.ImageContainter}><img src={img} alt=''/></span>
                <div className={classes.ContactDetails}>
                    <div className={classes.FloatedLeft}>
                        <span>{props.room.name}</span>
                        <span className={classes.LastMessage}>Honey: Love you too babe.{/*props.lastMessage*/}</span>
                    </div>
                    <div className={classes.FloatedRight}>
                        <span className={classes.LastUpdated}>{formatDate(props.room.updatedAt)}</span>
                        <div className={classes.UnreadMessagesContainer}>
                            <span className={classes.UnreadMessages}>{unreadMessages || 8}</span>
                            <i onClick={showOptionsHandler} className="fa fa-angle-down"></i>
                            { showOptions && 
                                <OptionsDropbar position={position} 
                                roomId={props.room.id}
                                show={showOptions} 
                                hideOptions={hideOptions}
                                options={[{name: 'Archive chat'},
                                {name: 'Mute'},
                                {name: !props.room.isPrivate ? 'Exit group':'Delete chat'},
                                {name: 'Pin chat'},
                                {name: 'Mark as unread'}
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
export default connect(mapStateToProps)(contact);