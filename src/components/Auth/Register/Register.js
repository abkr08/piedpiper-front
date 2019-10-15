import React, { Component } from 'react';
import classes from './Register.module.css';
import { connect } from 'react-redux';
import * as actionCreators from '../../../store/actions/actionIndex';
import Input from '../../UI/Input/Input';
import { checkValidity, updateObject} from '../../../shared/utility';
import Button from '../../UI/Button/Button';

class Register extends Component {

    state = {
      controls: {
       name: {
          elementType: 'input',
          elementConfig: {
            placeholder: 'Enter your full name',
            type: 'text'
          },
          value: '',
          validation: {
            required: true
          },
          valid: false,
          touched: false
        },
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
        username: {
          elementType: 'input',
          elementConfig: {
              placeholder: 'Enter username',
              type: 'text'
          },
          value: '',
          validation: {
              required: true
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
        },
        password2: {
          elementType: 'input',
          elementConfig: {
              placeholder: 'Confirm your password',
              type: 'password'
          }, 
          value: '',
          validation: {
              required: true,
              minLength: 8,
              isEqual: false
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
  })
  const updatedForm = updateObject(this.state.controls, {
      [inputIdentifier]: updatedFormElement
  });
  let formIsValid = true;
  for (let key in updatedForm){
      formIsValid = updatedForm[key].valid && formIsValid;
  }
  this.setState({controls: updatedForm, formIsValid: formIsValid});
  };

  onSubmit = event => {
    event.preventDefault();
    let { password, password2} = this.state.controls;
    console.log(password.value, password2.value)
    if (password.value !== password2.value){
      alert('passwords do not match');
    } else {
    const controls = { ...this.state.controls };
    const data = {};
    for (let control in controls){
      data[control] = controls[control]['value'];
    }
    this.props.onRegister(data);
    }
    
  };

  componentDidUpdate () {
    if (this.props.registrationSuccess){
      this.props.history.push('/login');
    }
  }
  render() {
    let formElements = [];
    for (let key in this.state.controls){
      formElements.push({
        id: key,
        config: this.state.controls[key] 
      });
    }
    let form = formElements.map(formElement => {
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
      <div className={classes.RegisterBox}>
        <h2> Register </h2>
        <form onSubmit={this.onSubmit}>
          {form}
          <Button btnType='Success' disabled={!this.state.formIsValid} >Register</Button>
        </form>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    registrationSuccess: state.auth.registrationSuccess
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onRegister: data => dispatch(actionCreators.onRegister(data))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Register);
