import React, { Component } from "react";
import {Route, withRouter, Switch, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import IncomingCall from './containers/Call/IncomingCallNotification/IncomingCall';
import Register from "./components/Auth/Register/Register";
import Login from "./components/Auth/Login/Login";
import Logout from "./components/Auth/Logout/Logout";
import Navbar from "./components/UI/Navigation/Navbar";
import ChatScreen from './containers/PiperChat/ChatScreen';
import * as actionCreators from './store/actions/actionIndex';
import Call from './containers/Call/Call';
import "./App.css";
import Modal from "./containers/Modal/Modal.js";

import ringtone from './assets/audio/simple_ring.mp3';


class App extends Component {

  state = {
    showCallNotification: false
  }
  componentDidMount() {
    this.props.onAuth();
    if (!this.props.isLoggedIn){
      this.props.history.push('/login')
    } 
  }
  
  componentDidUpdate () {
    let { isLoggedIn, channel, callEnded } = this.props;
    if (isLoggedIn){
      if (!channel){
        // this.props.getCallerReady();
      }
      // if(callEnded){
      //   this.ringtoneRef.pause();
      //   this.ringtoneRef.currentTime = 0;
      // }
    }
  }
  acceptCall = () => {
    this.props.callAccepted();
  }

  rejectCall = () => {
    const { caller, callRejected } = this.props;
    callRejected(caller);
  }
  render() {
    let chatScreen = null;
      if (this.props.isLoggedIn){
        if (this.props.callOngoing){
        chatScreen = (
          <React.Fragment>
            <Modal show><Call role='callee' callType={this.props.callType}/></Modal>
            <ChatScreen />
          </React.Fragment>
          );
      } else {
        if (this.props.incomingCall){
          chatScreen = (
            <>
              <IncomingCall acceptCall={this.acceptCall}
                rejectCall={this.rejectCall}
                caller={this.props.caller || 'Gotzil'}
                callType={this.props.callType || 'video'}
              />
              <ChatScreen />
            </>
          );
      } else {
        chatScreen = <ChatScreen />
      }
      }
    } 
    return (
        <div>
          <Navbar />
          <div className="container">
            {chatScreen}
            <audio src={ringtone} loop ref={ ring => this.ringtoneRef = ring } />
            <Switch>
              <Route path="/register" component={Register} />
              <Route path="/login" component={Login} />
              <Route path="/logout" component={Logout} />
              { !this.props.isLoggedIn && <Redirect to='/login' />}
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
    callType: state.call.callType,
    channel: state.call.channel,
    caller: state.call.caller,
    callOngoing: state.call.callOngoing,
    callEnded: state.call.callEnded
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onAuth: () => dispatch(actionCreators.checkAuthState()),
    getCallerReady: () => dispatch(actionCreators.getCallerReady()),
    callAccepted: () => dispatch(actionCreators.callAccepted()),
    callRejected: caller => dispatch(actionCreators.callRejected(caller))
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
