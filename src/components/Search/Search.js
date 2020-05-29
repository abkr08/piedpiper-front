import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/actionIndex'

import classes from './Search.module.css';

class Search extends Component {
    state = {
        showSubmitButton: false,
        showBackBtn: false,
    }

    // show back button when label is clicked
    labelClickedHandler = () => this.setState({ showBackBtn: true})

    render(){
        const { searchText, showBackBtn } = this.state;
        const { value, onSearch } = this.props;
        return (
            <div className={classes.Search}>
                <label className={classes.SearchLabel} onClick={this.labelClickedHandler}>
                    <span className={classes.SearchBtn}><i className='fa fa-search' /></span>
                    <input type='text' value={value} onChange={e => onSearch(e.target.value)} placeholder='Search contacts' />
                </label>
                { showBackBtn && 
                    <span className={classes.BackBtn}>
                        <i className='fa fa-arrow-left' />
                    </span>
                }
                {/* { searchText.length > 2 && 
                        <span className={classes.SubmitBtn} onClick={this.onSubmit}>
                            <i className='fa fa-check' />
                        </span>
                } */}
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onStartNewChat: data => dispatch(actionCreators.startNewChat(data))
    }
}
export default connect(null, mapDispatchToProps)(Search);