import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/actionIndex'

import classes from './Search.module.css';

class Search extends Component {
    state = {
        showSubmitButton: false,
        showBackBtn: false,
        searchText: ''
    }

    // show back button when label is clicked
    labelClickedHandler = () => this.setState({ showBackBtn: true})

    // Update text
    onChange = e => this.setState({ searchText: e.target.value })

    // Submit text
    onSubmit = () => {
        const { searchText } = this.state;
        let data = { chatParticipant: searchText.toLowerCase() };
        console.log(data)
        this.props.onStartNewChat(data);
        this.setState({
            showSubmitButton: false,
            showBackBtn: false,
            searchText: ''
        })
    }

    render(){
        const { searchText, showBackBtn } = this.state;
        return (
            <div className={classes.Search}>
                <label className={classes.SearchLabel} onClick={this.labelClickedHandler}>
                    <span className={classes.SearchBtn}><i className='fa fa-search' /></span>
                    <input value={searchText} type='text' onChange={this.onChange} placeholder='Search contacts' />
                </label>
                { showBackBtn && 
                    <span className={classes.BackBtn}>
                        <i className='fa fa-arrow-left' />
                    </span>
                }
                { searchText.length > 2 && 
                        <span className={classes.SubmitBtn} onClick={this.onSubmit}>
                            <i className='fa fa-check' />
                        </span>
                }
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