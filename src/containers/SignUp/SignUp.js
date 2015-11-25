import React, { Component, PropTypes } from 'react'
import config from 'config'
import { connect } from 'react-redux'
import DocumentMeta from 'react-document-meta'
import { initialize } from 'redux-form'
import { SignUpForm } from 'components'

@connect(
  () => ({}),
  { initialize })
export default class Survey extends Component {
  static propTypes = {
    initialize: PropTypes.func.isRequired
  }

  handleSubmit = (data) => {
    window.alert('Data submitted! ' + JSON.stringify(data))
    this.props.initialize('survey', {})
  }

  render () {
    return (
      <div className='container'>
        <h1>Sign Up</h1>
        <DocumentMeta title={`${config.app.title}: Sign Up`}/>

        <SignUpForm onSubmit={this.handleSubmit}/>
      </div>
    )
  }
}
