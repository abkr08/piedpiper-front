import React from 'react';
import classes from'./EditableDiv.module.css';
import { getSVG } from '../../../shared/utility';

const editableDiv = ({ contentEditable, content, placeHolderText, setRef, title, onSubmit, onEditStart}) => (
    <div className={classes.EditableDiv}>
    { title && 
        <span className={classes.Title}>{title}</span>
    }
    <div className={classes.Container}>
    <div
    className={classes.ContentEditable}
    contentEditable={contentEditable} 
    placeholder={placeHolderText}
    ref={setRef}
    >
        {content}
    </div>
    <span onClick={contentEditable ? onSubmit : onEditStart}>
        {  contentEditable ? 
            getSVG('checkmark', 'black', 24, 24, 0.4) 
            : getSVG('pencil', 'black', 24, 24, 0.4)
        }
    </span>
    </div>
    </div>
)

export default editableDiv;