import React, { Component } from 'react';
import EditableDiv from '../UI/EditableDiv/EditableDiv';
import * as constants from '../../shared/constants';
import classes from './RoomInfo.module.css';
import { getSVG, formatDate } from '../../shared/utility';

class RoomInfo extends Component {
    state={
        contentEditable: false
    }

    onEditStart = () => {
        this.setState({ contentEditable: true })
        let self = this;
        setTimeout(function() {
            self.contentEditable.focus();
        }, 0)
    }

    onSubmit = () => {
        this.setState({ contentEditable: false })
    }
    setRef = contentEditable => this.contentEditable = contentEditable
    render(){
        const { room, username, toggleShowRoomDetails } = this.props;
        let { displayImage, roomType, roomName, members, createdAt } = room;
        const { contentEditable } = this.state;
 
        let otherUser;
        let isPrivate = roomType == constants.PRIVATE;
        if (isPrivate){
            otherUser = members.filter(mem => mem.username != username)[0];
            displayImage = otherUser.profile.displayImage
        }
        return (
            <div className={classes.RoomInfo}>
                <div className={classes.Header}>
                    <span onClick={toggleShowRoomDetails}>{getSVG('close', '#263238', 24, 24, 0.4)}</span>
                </div>
                <section className={classes.Section}>
                    <span className={classes.ImageContainer}>
                        <img src={displayImage} alt='' />
                    </span>
                    <span className={classes.RoomName}>
                        <EditableDiv
                            // title='Description'
                            content={isPrivate ? otherUser.username : roomName}
                            contentEditable={contentEditable}
                            // placeHolderText='Add room description'
                            setRef={this.setRef}
                            onEditStart={this.onEditStart}
                            onSubmit={this.onSubmit}
                        />
                    </span>
                    <span className={classes.CreatedAt}>Created at {formatDate(createdAt)}</span>
                </section>
                <section className={classes.Section}>
                    <EditableDiv
                        title='Description'
                        content={'****'}
                        contentEditable={contentEditable}
                        placeHolderText='Add room description'
                        setRef={this.setRef}
                        onEditStart={this.onEditStart}
                        onSubmit={this.onSubmit}
                    />
                </section>
            </div>
        )
    }
}

export default RoomInfo;