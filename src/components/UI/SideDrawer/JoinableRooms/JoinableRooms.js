import React from 'react';
import JoinableRoom from './JoinableRoom/JoinableRoom';
const joinableRooms = props => {
    return (
    <React.Fragment>
        {props.joinableRooms.map((room, i) => {
            return <JoinableRoom key={i} groupImage={room.groupImage} 
            name={room.name} id={room.id} lastMessage={room.lastMessage}/>
        })}
    </React.Fragment>)
}

export default joinableRooms;