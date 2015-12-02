import React, { Component, PropTypes } from 'react'
import config from 'config'
import { connect } from 'react-redux'
import DocumentMeta from 'react-document-meta'
import { initialize } from 'redux-form'
import { login } from 'redux/modules/auth'
import { SignUpForm } from 'components'
import { submit as signup } from 'redux/modules/signup'

@connect(
  () => ({}),
  { initialize, login, signup })
export default class Survey extends Component {
  static propTypes = {
    initialize: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    signup: PropTypes.func.isRequired
  }

  handleSubmit = (data) => {
    return this.props.signup(data)
    .then(user => {
      this.props.initialize(SignUpForm.formName, {})
      return user
    })
    .then(user => this.props.login(data.email, data.password))
    .catch(error => {
      const errors = {
        _error: error.message
      }
      throw errors
    })
  }

  render () {
    return (
      <div className='container'>
        <h1>{/* @todo: fix this; Leave an empty header for better styling */}</h1>
        <DocumentMeta title={`${config.app.title}: Sign Up`}/>

        <SignUpForm onSubmit={this.handleSubmit}/>
      </div>
    )
  }
}
