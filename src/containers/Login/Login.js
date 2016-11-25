import config from 'config'
import isEmpty from 'lodash/isEmpty'
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import { _notifier } from 'react-notification-system'
import { Link } from 'react-router'
import { Button, Col, Grid, Input } from 'react-bootstrap'
import DocumentMeta from 'react-document-meta'
import * as authActions from 'redux/modules/auth'
import { loadListMetaFromLocal } from 'redux/modules/listMeta'

@connect(
  state => ({user: state.auth.user}),
  { ...authActions, loadListMetaFromLocal })
export default class Login extends Component {
  static propTypes = {
    user: PropTypes.object,
    loadListMetaFromLocal: PropTypes.func,
    login: PropTypes.func,
    logout: PropTypes.func
  }

  handleSubmit (event) {
    event.preventDefault()
    const {
      email,
      password,
      rememberEmail
    } = this.refs
    const emailValue = email.getValue().trim()
    const passwordValue = password.getValue()
    const rememberEmailValue = rememberEmail.getChecked()
    if (isEmpty(emailValue) || isEmpty(passwordValue)) {
      _notifier.addNotification({
        position: 'tc',
        autoDismiss: 15,
        message: 'Missing email or password',
        level: 'error'
      })
      return
    }
    if (rememberEmailValue) {
      window.localStorage.setItem('rememberEmail', emailValue)
    } else {
      window.localStorage.setItem('rememberEmail', null)
    }

    return this.props.login(emailValue, passwordValue)
    .catch(error => {
      _notifier.addNotification({
        position: 'tc',
        autoDismiss: 15,
        message: `There was a problem logging in. ${error.message}.`,
        level: 'error'
      })
    })
    .then(() => {
      return this.props.loadListMetaFromLocal()
    })
    // .finally(() => {
    //   email.refs.input.value = ''
    //   password.refs.input.value = ''
    // })
  }

  render () {
    const {user, logout} = this.props
    const savedEmail = (__CLIENT__ && window.localStorage.getItem('rememberEmail')) || ''
    const styles = require('./Login.scss')
    return (
      <div className={styles.loginPage + ' container'}>
        <DocumentMeta title={`${config.app.title}: Login`}/>
        <h1>{/* @note: Leave an empty header for better styling */}</h1>
        {!user &&
        <Grid className='text-center'>
          <form className='login-form form-horizontal' onSubmit={this.handleSubmit.bind(this)}>
            <Col md={4} mdOffset={4}>
              <Input type='email' ref='email' defaultValue={savedEmail} placeholder='Enter your email'/>
              <Input type='password' ref='password' placeholder='Enter your password'/>
              <Input type='checkbox' ref='rememberEmail' defaultChecked={!isEmpty(savedEmail)} label='Remember Email'/>
              <Button bsStyle='success' type='submit' onClick={this.handleSubmit.bind(this)}>
                Log In
              </Button>
              <Link to='/sign-up'>
                <Button bsStyle='link'>
                  No account? Sign up now!
                </Button>
              </Link>
              <Link to='/forgot-password'>
                <Button bsStyle='link'>
                  Forgot password?
                </Button>
              </Link>
            </Col>
          </form>
        </Grid>
        }
        {user &&
        <div>
          <p>You are currently logged in as {user.name}.</p>
          <div>
            <Button bsStyle='danger' onClick={logout}>
              Log Out
            </Button>
          </div>
        </div>
        }
      </div>
    )
  }
}
