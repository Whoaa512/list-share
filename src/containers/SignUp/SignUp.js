import React, { Component, PropTypes } from 'react'
import config from 'config'
import { connect } from 'react-redux'
import DocumentMeta from 'react-document-meta'
import { initialize } from 'redux-form'
import { login } from 'redux/modules/auth'
import { SignUpForm } from 'components'
import { submit as signup } from 'redux/modules/signup'
import { load as loadLists } from 'redux/modules/lists'

@connect(
  () => ({}),
  { initialize, login, signup, loadLists })
export default class Survey extends Component {
  static propTypes = {
    initialize: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    loadLists: PropTypes.func.isRequired,
    signup: PropTypes.func.isRequired
  }

  handleSubmit = (data) => {
    return this.props.signup(data)
    .then(user => {
      this.props.initialize(SignUpForm.formName, {})
      return user
    })
    .then(user => this.props.login(data.email, data.password))
    .then(() => this.props.loadLists())
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
        <h1>{/* @note: Leave an empty header for better styling */}</h1>
        <DocumentMeta title={`${config.app.title}: Sign Up`}/>

        <SignUpForm onSubmit={this.handleSubmit}/>
      </div>
    )
  }
}
