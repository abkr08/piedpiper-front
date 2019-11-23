import React, { Component } from "react";
import {Link} from "react-router-dom";
import { connect } from 'react-redux';

import classes from "./Navbar.module.css";

class Navbar extends Component {
  render() {
    const { isLoggedIn } = this.props;
    let displayedElements = (
      <ul>
        <div>
          <li>
            <Link to="/">
              <div className={classes.Brand}>
                PiperChat
              </div>
              </Link>
          </li>
        </div>
        <div className={classes.FloatedRight}>
          <li>
              <Link to="/login">
                <div className={classes.NavItem}>
                  Login
                </div>
              </Link>
            </li>
            <li>
              <Link to="/register">
                <div className={classes.NavItem}>
                  Join Now
                </div>
              </Link>
            </li>
        </div>  
      </ul>);
        if (isLoggedIn){
          displayedElements = (<ul>
          <li>
            <Link to="/">
              <div className={classes.Brand}>
               PiperChat
              </div>
              </Link>
          </li>
          <li>
            <Link to="/logout">
              <div className={classes.NavItem}>
                Logout
              </div>
            </Link>
          </li>
          </ul>
        );
        }
    return (
      <div className={classes.Navbar} style={ isLoggedIn ? {display: 'none' } : null}>
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
