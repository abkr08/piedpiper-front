import React from 'react';

import { formatTime } from '../../shared/utility';

import classes from './Chat.module.css';


const chat = ({ byCurrentUser, isPrivate, sender, text, time}) => {
    let attachedClasses = [classes.Chat];
    if (byCurrentUser){
        attachedClasses.push(classes.ByCurrentUser);
    }
    return (
            <div className={attachedClasses.join(' ')}>
                <li>
                    { !isPrivate && (
                        <>
                            <span className={classes.Sender}>{sender}</span>
                            <br />
                        </>
                    )}
                    <div className={classes.Text}>{text}</div>
                    {/* <br /> */}
                    <div className={classes.Time}>{formatTime(time)}</div>
                </li>        
            </div>
    )
}

export default chat;