import React from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './IncomingCall.module.css';
import { getSVG } from '../../../shared/utility';

const IncomingCall = props => (
    <div className={classes.IncomingCall}>
        <span className={classes.InfoText}>Incoming {props.callType} call from {props.caller}</span>
        <span className={classes.Buttons}>
            <span  onClick={props.acceptCall}
            className={classes.ReceiveCallBtn}>
                {getSVG('phone', 'white', '40', '40')}
            </span>
            <span  onClick={props.rejectCall}
            className={classes.EndCallBtn}>
                {getSVG('phone', 'white', '40', '40')}
            </span>
            {/* <Button clicked={props.acceptCall} btnType='Success'>Accept</Button>
            <Button clicked={props.rejectCall} btnType='Danger'>Reject</Button> */}
        </span>
    </div>
)

export default IncomingCall;