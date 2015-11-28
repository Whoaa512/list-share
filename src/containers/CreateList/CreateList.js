import React, { Component, PropTypes } from 'react'
import config from 'config'
import { connect } from 'react-redux'
import DocumentMeta from 'react-document-meta'
import { initialize } from 'redux-form'
import { CreateListForm } from 'components'

@connect(
  () => ({}),
  { initialize })
export default class CreateList extends Component {
  static propTypes = {
    initialize: PropTypes.func.isRequired
  }

  handleSubmit = (data) => {
    console.log('submitting', data)
  }

  render () {
    return (
      <div className='container'>
        <h1>{/* @todo: fix this; Leave an empty header for better styling */}</h1>
        <DocumentMeta title={`${config.app.title}: Create a List`}/>
        <CreateListForm onSubmit={this.handleSubmit} />
      </div>
    )
  }
}
