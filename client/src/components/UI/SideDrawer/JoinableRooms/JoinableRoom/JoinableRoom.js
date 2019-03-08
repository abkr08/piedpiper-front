import React from 'react';
import { connect } from 'react-redux';
import * as chatActionCreators from '../../../../../store/actions/actionIndex';
import classes from './JoinableRoom.module.css';

const joinableRoom = props => {
    return (
    <span onClick={props.joinRoom(props.id)} className={classes.JoinableRoom}>
        <img src={props.groupImage} alt='' />
        <span>
            <p>{props.name}</p>
            <p>{props.lastMessage}</p>
        </span>
    </span>
    )
}

const mapDispatchtoProps = dispatch => {
    return {
        joinRoom: id => dispatch(chatActionCreators.joinRoom(id))
    }
}
export default connect(null,mapDispatchtoProps)(joinableRoom);