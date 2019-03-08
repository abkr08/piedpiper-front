import React, {Component} from 'react';
import classes from './Modal.module.css';
import Backdrop from '../../components/UI/Backdrop/Backdrop';
class Modal extends Component {
    render(){
        let modal = null;
        if (this.props.show){
            modal = (
            <React.Fragment>
                <Backdrop show={this.props.show} clicked={this.props.backdropClicked}/>
                <div className={classes.Modal}>{this.props.children}</div>
            </React.Fragment>
        );
        } 
        return modal;
    
    }
}

export default Modal;