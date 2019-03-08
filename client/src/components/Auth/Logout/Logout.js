import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../../../store/actions/actionIndex';

class Logout extends Component {
    componentDidMount(){
        this.props.logout();
        this.props.history.push("/")
    }
    render() {
        return (
            <div></div>
        )
    }
}
const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actionCreators.onLogout())
    }
}
export default connect(null, mapDispatchToProps)(Logout);