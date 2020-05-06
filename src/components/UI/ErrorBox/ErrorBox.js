import React from 'react';
import classes from './ErrorBox.module.css'

const errorBox = error => {
    let errorMessage = '';
      if (error.error) {
        const { data } = error.error.response; 
        if (data.password) {
          errorMessage = data.password;
        } else if (data.confirmPassword) {
          errorMessage = data.confirmPassword;
        } else if (data.name) {
          errorMessage = error.name;
        } else if (data.authError) {
          errorMessage = data.authError;
        } else if (data.username) {
          errorMessage = data.username
        }
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