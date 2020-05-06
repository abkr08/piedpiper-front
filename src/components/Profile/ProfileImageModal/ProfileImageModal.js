import React from 'react';
import classes from './ProfileImageModal.module.css';


const profileImageModal = props => {
    return (
        <div className={classes.ProfileImageModal}>
            <header>
                <span><i className='fa fa-close'/></span>
                <h3>Drag the image to adjust</h3>
                <span><i className='fa fa-back'/> Upload</span>
            </header>
            <img src={props.image}/>
            <button>check</button>
            <footer></footer>
        </div>
    )
}

export default profileImageModal;