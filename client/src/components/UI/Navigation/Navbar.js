import React, { Component } from "react";
import {Link} from "react-router-dom";
import { connect } from 'react-redux';

import classes from "./Navbar.module.css";

class Navbar extends Component {
  render() {
    let displayedElements = (<ul>
          <li>
            <Link to="/">
              {/* <div className="navIcon">
                <i className="fa fa-home" aria-hidden="true" />
              </div> */}
              <div className={[classes.NavItem, classes.Brand].join(' ')}>
                <span data-text="PiperChat"> </span>
                PiperChat
              </div>
              </Link>
          </li>
          <li>
            <Link to="/login">
              {/* <div className="navIcon">
                <i className="fa fa-sign-in" aria-hidden="true" />
              </div> */}
              <div className={classes.NavItem}>
                <span data-text="Login"> </span>
                Login
              </div>
            </Link>
          </li>
          <li>
            <Link to="/register">
              {/* <div className="navIcon">
                <i className="fa fa-user-plus" aria-hidden="true" />
              </div> */}
              <div className={classes.NavItem}>
                <span data-text="Register"> </span>
                Register
              </div>
            </Link>
          </li>
        </ul>);
        if (this.props.isLoggedIn){
          displayedElements = (<ul>
          <li>
            <Link to="/">
              {/* <div className="navIcon">
                <i className="fa fa-home" aria-hidden="true" />
              </div> */}
              <div className={classes.NavItem}>
                <span data-text="PiperChat"> </span>
               PiperChat
              </div>
              </Link>
          </li>
          <li>
            <Link to="/logout">
              {/* <div className="navIcon">
                <i className="fa fa-sign-out" aria-hidden="true" />
              </div> */}
              <div className={classes.NavItem}>
                <span data-text="Logout"> </span>
                Logout
              </div>
            </Link>
          </li>
          </ul>);
        }
    return (
      <div className={classes.Navbar}>
        {displayedElements}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    isLoggedIn: state.auth.token !== null
  }
}
export default connect(mapStateToProps)(Navbar);
