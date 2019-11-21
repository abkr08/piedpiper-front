import React from 'react';
import classes from './ErrorBox.module.css'

const errorBox = error => {
    
    let errorMessage = '';
      if (error.error) {
        errorMessage = error.error.response.data.authError
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