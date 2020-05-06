import React, { Component } from "react";
import {Redirect} from 'react-router';
import { connect } from 'react-redux';
import * as actionCreators from '../../../store/actions/actionIndex';
import classes from './Login.module.css'; 
import Input from '../../UI/Input/Input';
import { checkValidity, updateObject } from '../../../shared/utility';
import Button from '../../UI/Button/Button'; 
import ErrorBox from '../../UI/ErrorBox/ErrorBox';
import swal from 'sweetalert2';

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
      formIsValid: false,
      loading: false
  }

  componentDidUpdate () {
    const { authError } = this.props;
    const { loading } = this.state;
    if (authError && loading){
      this.setState({loading: false})
    }
  }
  componentWillMount(){
    const fields = ['authError', 'registrationSuccess']
    this.props.resetFields(fields);
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
    const { onLogIn } = this.props;
    this.setState({ loading: true})
    e.preventDefault();
    const controls = {...this.state.controls}
    const data = {};
    for (let control in controls){
      data[control] = controls[control]['value'];
    }
    onLogIn(data);
  };

  comingSoon = () => {
    swal.fire({
      title: 'Coming soon',
      icon: 'info',
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText:
        '<i class="fa fa-thumbs-up"></i> Great!'
    })
  }

  render() {
    const { loading, controls, formIsValid } = this.state;
    const { authError, isLoggedIn, history } = this.props
    let redirect = null;
    if (isLoggedIn){
      redirect = <Redirect to="/"/>;
    }
    let formElements = [];
    for (let key in controls){
      formElements.push({
        id: key,
        config: controls[key]
      });
    }
    const form = formElements.sort((a,b) => a.id.localeCompare(b.id)).map(formElement => {
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
        { authError && <ErrorBox error={authError}/> }
          <form onSubmit={this.onSubmit}>
            {form}
            <span className={classes.AuthOptions}>
              <p onClick={() => history.push('/register')}>New to PiperChat?</p>
              <p>Forgot Password?</p>
            </span>
            <Button btnType='Success' disabled={!formIsValid}>
            {
                loading ? (
                  <>  
                    <span className={classes.LoadingText}>
                      Logging in...
                    </span>
                    <i className='fas fa-spinner fa-spin' />
                  </>
                ) : (
                  <>
                  Login
                  </>
                )
              }
            </Button>
          </form>
          <hr />
          <div className={classes.LoginOptions}>
            <h3>Login With</h3>
            <span className={classes.LoginOptionsIcons}>
              <span onClick={this.comingSoon}><i className='fab fa-linkedin' /></span>
              <span onClick={this.comingSoon}><i className='fab fa-google' /></span>
              <span onClick={this.comingSoon}><i className='fab fa-facebook' /></span>
            </span>
          </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    isLoggedIn: state.auth.token !== null,
    authError: state.auth.authError
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLogIn: (data) => dispatch(actionCreators.onLogIn(data)),
    resetFields: fields => dispatch(actionCreators.resetFields(fields))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);
