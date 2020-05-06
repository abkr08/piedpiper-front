import React, { Component } from 'react';
import classes from './Register.module.css';
import { connect } from 'react-redux';
import * as actionCreators from '../../../store/actions/actionIndex';
import Input from '../../UI/Input/Input';
import { checkValidity, updateObject} from '../../../shared/utility';
import Button from '../../UI/Button/Button';
import ErrorBox from '../../UI/ErrorBox/ErrorBox'

class Register extends Component {

    state = {
      controls: {
       fullName: {
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
        confirmPassword: {
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
        formIsValid: false,
        loading: false
  }
  componentWillMount(){
    this.props.resetFields(['authError']);
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
    this.setState({ loading: true})
    event.preventDefault();
    const controls = { ...this.state.controls };
    const data = {};
    for (let control in controls){
      data[control] = controls[control]['value'];
    }
    this.props.onRegister(data);
  };

  componentDidUpdate () {
    const { loading } = this.state;
    const { error, registrationSuccess, history } = this.props;
    if (registrationSuccess){
      history.push('/login');
    } else if (error && loading){
      this.setState({loading: false})
    }
  }
  render() {
    const { loading, controls, formIsValid } = this.state;
    const { authError } = this.props;
    let formElements = [];
    for (let key in controls){
      formElements.push({
        id: key,
        config: controls[key] 
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
        {authError && <ErrorBox error={authError}/>}
        <form onSubmit={this.onSubmit}>
          {form}
          <p onClick={() => this.props.history.push('/login')}>Already signed up?</p>
          <Button btnType='Success' disabled={!formIsValid} >
          {
                loading ? (
                  <>  
                    <span className={classes.LoadingText}>
                      Joining...
                    </span>
                    <i className='fas fa-spinner fa-spin' />
                  </>
                ) : (
                  <>
                  Join Now
                  </>
                )
              }
          </Button>
        </form>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    registrationSuccess: state.auth.registrationSuccess,
    authError: state.auth.authError,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onRegister: data => dispatch(actionCreators.onRegister(data)),
    resetFields: fields => dispatch(actionCreators.resetFields(fields))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Register);
