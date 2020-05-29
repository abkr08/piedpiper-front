import React from 'react';
import classes from './ErrorBox.module.css'

const errorBox = ({error}) => {
    let errorMessage = '';
      if (error.response) {
        const { data } = error.response;
        errorMessage = data.error;
      } else {
        errorMessage = error.message
      }
    return (
        <div className={classes.ErrorBox}>
            { errorMessage }
        </div>
    )
}

export default errorBox;