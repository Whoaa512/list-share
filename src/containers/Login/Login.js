import config from 'config'
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router'
import { Button } from 'react-bootstrap'
import DocumentMeta from 'react-document-meta'
import * as authActions from 'redux/modules/auth'

@connect(
  state => ({user: state.auth.user}),
  authActions)
export default class Login extends Component {
  static propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const email = this.refs.email
    const password = this.refs.password
    return this.props.login(email.value, password.value)
    .then(() => {
      email.value = ''
      password.value = ''
    })
    .catch(error => {
      console.error(error, 'Problem logging in')
    })
  }

  render () {
    const {user, logout} = this.props
    const styles = require('./Login.scss')
    return (
      <div className={styles.loginPage + ' container'}>
        <DocumentMeta title={`${config.app.title}: Login`}/>
        <h1>Login</h1>
        {!user &&
        <div className='text-center'>
          <form className='login-form form-horizontal' onSubmit={this.handleSubmit}>
            <div className='form-group'>
              <input type='text' ref='email' placeholder='Enter your email'/>
            </div>
            <div className='form-group'>
              <input type='password' ref='password' placeholder='Enter your password'/>
            </div>
            <div className='form-group'>
              <button className='btn btn-success' onClick={this.handleSubmit}>
                <i className='fa fa-sign-in'/>
                Log In
              </button>
              <Link to='/sign-up'>
                <Button>
                  Sign Up
                </Button>
              </Link>
            </div>
          </form>
        </div>
        }
        {user &&
        <div>
          <p>You are currently logged in as {user.name}.</p>
          <div>
            <button className='btn btn-danger' onClick={logout}>
              <i className='fa fa-sign-out'/>
              Log Out
            </button>
          </div>
        </div>
        }
      </div>
    )
  }
}
