import React, { useState } from 'react';
import classes from './NoContacts.module.css'
import SideDrawer from '../UI/SideDrawer/SideDrawer';

const noContacts = props => {
    const [showSideDrawer, toggleShowSideDrawer] = useState(false);
    const [actionType, updateActionType] = useState('');

    const actionClickedHandler = actionType => {
        toggleShowSideDrawer(prevState => !prevState);
        updateActionType(actionType);
    }
    return (
        <div className={classes.NoContacts}>
            <span>You have no contacts</span>
            <div className={classes.UserActions}>
                <span className={classes.UserAction} onClick={() => actionClickedHandler('Add contact')}>
                    <span className={classes.ActionsIcons}><i className="fas fa-search" /></span>
                    <span>Add Contact</span>
                </span>
                <span className={classes.UserAction} onClick={() => actionClickedHandler('Create a group')}>
                <span className={classes.ActionsIcons}><i className="fas fa-users" /></span>
                <span>Create a group</span>
                </span>
            </div>
            <SideDrawer show={showSideDrawer} actionType={actionType} hideSideDrawer={() => toggleShowSideDrawer(false)} />
        </div>
    )
}

export default noContacts;