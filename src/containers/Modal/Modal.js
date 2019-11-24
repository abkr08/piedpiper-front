import React from 'react';
import classes from './Modal.module.css';
const  modal = ({ show, children }) => {
        return show ? (
            <div className={classes.Modal}>{children}</div>
        ) : null;
}

export default modal;