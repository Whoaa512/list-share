import config from 'config'
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router'
import { Button, Col, Grid, Input } from 'react-bootstrap'
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

  handleSubmit (event) {
    event.preventDefault()
    const email = this.refs.email
    const password = this.refs.password
    return this.props.login(email.getValue(), password.getValue())
    .then(() => {
      email.refs.input.value = ''
      password.refs.input.value = ''
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
        <h1>{/* @todo: fix this; Leave an empty header for better styling */}</h1>
        {!user &&
        <Grid className='text-center'>
          <form className='login-form form-horizontal' onSubmit={this.handleSubmit.bind(this)}>
            <Col md={4} mdOffset={4}>
              <Input type='text' ref='email' placeholder='Enter your email'/>
              <Input type='password' ref='password' placeholder='Enter your password'/>
              <Button bsStyle='success' type='submit' onClick={this.handleSubmit.bind(this)}>
                Log In
              </Button>
              <Link to='/sign-up'>
                <Button bsStyle='link'>
                  No account? Sign up now!
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
