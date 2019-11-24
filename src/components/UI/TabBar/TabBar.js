import React from 'react';
import classes from './TabBar.module.css';

const tabBar = ({ goBack, tabName }) => (
    <div className={classes.TabBar}>
        <i className='fa fa-arrow-left' onClick={goBack}/>
        <span>{tabName}</span>
    </div>
)

export default tabBar;