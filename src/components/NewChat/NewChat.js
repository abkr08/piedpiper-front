import React from 'react';
import Search from '../Search/Search'

const newChat = props => {
    return (
        <div>
            <Search 
            placeholder='Who do you wanna chat with?' 
            submit={props.startNewChaHandler}
            />

        </div>
    )
}

export default newChat;