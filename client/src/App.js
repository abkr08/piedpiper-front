import React, { Component } from "react";
import {Route, withRouter, Switch } from "react-router-dom";
import { connect } from 'react-redux';

import Register from "./components/Auth/Register/Register";
import Login from "./components/Auth/Login/Login";
import Logout from "./components/Auth/Logout/Logout";
import Navbar from "./components/UI/Navigation/Navbar";
import ChatScreen from './containers/PiperChat/ChatScreen';
import * as actionCreators from './store/actions/actionIndex';
import Call from './containers/Call/Call';
import "./App.css";
import Modal from "./containers/Modal/Modal.js";

class App extends Component {

  componentDidMount() {
    this.props.onAuth();
  }
  render() {
    let chatScreen = null;
    if (this.props.isLoggedIn){
      if (this.props.incomingCall){
      chatScreen = (
        <React.Fragment>
          <Modal show><Call callType={this.props.callType}/></Modal>
          <ChatScreen />
        </React.Fragment>
      );
    } else {
      chatScreen = <ChatScreen />
    }
      
  }
    return (
        <div>
          <Navbar />
          <div className="container">
         {chatScreen}
          <Switch>
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/logout" component={Logout} />
            </Switch>
          </div>
        </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    isLoggedIn: state.auth.token !== null,
    incomingCall: state.call.incomingCall,
    callType: state.call.callType
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onAuth: () => dispatch(actionCreators.checkAuthState())
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
