import React, { Component } from "react";
import {Redirect} from 'react-router';
import { connect } from 'react-redux';
import * as actionCreators from '../../../store/actions/actionIndex';
import classes from './Login.module.css'; 
import Input from '../../UI/Input/Input';
import { checkValidity, updateObject } from '../../../shared/utility';
import Button from '../../UI/Button/Button'; 
import ErrorBox from '../../UI/ErrorBox/ErrorBox';

class Login extends Component {

  state = {
      controls: {
        email: {
          elementType: 'input',
          elementConfig: {
              placeholder: 'Enter your email',
              type: 'email'
          },
          value: '',
          validation: {
              required: true,
              isEmail: true
          },
          valid: false,
          touched: false
      },
      password: {
        elementType: 'input',
        elementConfig: {
            placeholder: 'Enter your password',
            type: 'password'
        }, 
        value: '',
        validation: {
            required: true,
            minLength: 8
        },
        valid: false,
        touched: false
    }
      },
      formIsValid: false
  }

  onChange = (event, inputIdentifier) => {
    const { value } = event.target;
    const updatedFormElement = updateObject(this.state.controls[inputIdentifier], {
      value: value,
      touched: true,
      valid: checkValidity(value, this.state.controls[inputIdentifier].validation)
    });
    const updatedForm = updateObject(this.state.controls, {
      [inputIdentifier]: updatedFormElement
    });
    let formIsValid = true;
  for (let key in updatedForm){
      formIsValid = updatedForm[key].valid && formIsValid;
  }
  this.setState({controls: updatedForm, formIsValid: formIsValid});
  };

  onSubmit = e => {
    e.preventDefault();
    const controls = {...this.state.controls}
    const data = {};
    for (let control in controls){
      data[control] = controls[control]['value'];
    }
    this.props.onLogIn(data);
  };
  render() {
    let redirect = null;
    if (this.props.isLoggedIn){
      redirect = <Redirect to="/"/>;
    }
    let formElements = [];
    for (let key in this.state.controls){
      formElements.push({
        id: key,
        config: this.state.controls[key]
      });
    }
    const form = formElements.map(formElement => {
      return <Input 
                key={formElement.id} elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={ event => this.onChange(event, formElement.id)}
            />
    })
    return (
      <div className={classes.Login}>
      {redirect}
        <h2> Login </h2>
        { this.props.error && <ErrorBox error={this.props.error}/> }
        <form onSubmit={this.onSubmit}>
          {form}
          <Button btnType='Success' disabled={!this.state.formIsValid}>Log in</Button>
        </form>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    isLoggedIn: state.auth.token !== null,
    error: state.auth.error
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLogIn: (data) => dispatch(actionCreators.onLogIn(data))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);
