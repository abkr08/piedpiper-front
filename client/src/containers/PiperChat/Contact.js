import React, { useState, useEffect } from 'react';
import classes from './Contact.module.css';
import img from '../../images/p37605.png'
import { connect } from 'react-redux';
import OptionsDropbar from '../../components/UI/OptionsDropbar/OptionsDropbar'

const contact = props => {
    const [showOptions, toggleShowOptions] = useState(false);
    const [position, updatePosition] = useState({});
    const [name, setName] = useState('');
    const contactName = props.room.userIds.filter(username => username !== props.user).join('');
    console.log(contactName)
    const showOptionsHandler = event => {
        let pos = {};
        pos.x = event.clientX + 200;
        pos.y = event.clientY;
        toggleShowOptions(true);
        updatePosition(pos)
    }
    const hideOptions = () => {
        toggleShowOptions(false);
        updatePosition({})
    }
    
    useEffect(()=> {
        if(props.room.isPrivate && contactName){
            console.log(props.room.userIds)
            setName(contactName);
        } else {
            setName(props.room.name);
        }
        
    });
    // setInterval(()=> console.log(name), 1000)
    let attachedClasses = [classes.Contact];
    let unreadMessages = "";
    if (props.Active){
        attachedClasses.push(classes.Active); 
    }
    if (props.unopenedMessages[props.id]){
        unreadMessages = props.unopenedMessages[props.id].length;
    }
    let contact = null;
    if (name !== ''){
        contact = (<div className={attachedClasses.join(' ')} onClick={props.clicked}>
        <img src={img} alt=''/>
        <div>
            <p>{name}</p>
            <p>{props.lastMessage}</p>
        </div>
        <div className={classes.FloatedRight}>
            <span>{unreadMessages}</span>
            <i onClick={showOptionsHandler} className="fa fa-angle-down"></i>
            { showOptions && 
                <OptionsDropbar position={position} 
                        // optionClicked={(event, option) => this.optionClicked(option)}
                        roomId={props.room.id}
                        show={showOptions} 
                        hideOptions={hideOptions}
                        options={[{name: 'Archive chat'},
                        {name: 'Mute'},
                        {name: !props.room.isPrivate? 'Exit group':'Delete chat'},
                        {name: 'Pin chat'},
                        {name: 'Mark as unread'}
                        ]}/>}
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