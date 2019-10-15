import React from 'react';
import classes from './Chat.module.css';


const chat = props => {
    let attachedClasses = [classes.Chat];
    if (props.byCurrentUser){
        attachedClasses = [classes.ByCurrentUser];
    }
    return (
        // <div className={classes.Wrapper} style={{position: 'relative'}}>
            <div className={attachedClasses.join('')}>
                <li>
                    <span className={classes.Sender}>{props.sender}</span>
                    <br />
                    <span className={classes.Text}>{props.text}</span>
                </li>        
            </div>
        // </div>
    )
}

export default chat;