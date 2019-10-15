import React from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './IncomingCall.module.css';

const IncomingCall = props => (
    <div className={classes.IncomingCall}>
        <span>Incoming {props.callType} call from {props.caller}</span>
        <span className={classes.Buttons}>
            <Button clicked={props.acceptCall} btnType='Success'>Accept</Button>
            <Button clicked={props.rejectCall} btnType='Danger'>Reject</Button>
        </span>
    </div>
)

export default IncomingCall;