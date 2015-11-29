import React, { Component, PropTypes } from 'react'
import config from 'config'
import { connect } from 'react-redux'
import DocumentMeta from 'react-document-meta'
import { pushState } from 'redux-router'
import { initialize } from 'redux-form'
import { ListForm } from 'components'
import { create } from 'redux/modules/lists'
import { getUserId } from 'redux/modules/auth'
import { load as loadItems } from 'redux/modules/items'

@connect(
  mapStateToProps,
  { initialize, create, loadItems, pushState })
export default class CreateList extends Component {
  static propTypes = {
    create: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    loadItems: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired
  }

  handleSubmit = (data) => {
    data.items = JSON.parse(data.items)

    return this.props.create(data, this.props.userId)
    .then(list => {
      // load new items
      return this.props.loadItems(list.items)
    })
    // @todo: tell the user they were successful
    .then(() => this.props.pushState(null, '/my-list'))
    .then(() => {
      // @note: have to use old school way to reset since reset was buggy
      return this.props.initialize(ListForm.formName, {})
    })
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
        <DocumentMeta title={`${config.app.title}: Create a List`}/>
        <ListForm type='create' onSubmit={this.handleSubmit} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    userId: getUserId(state)
  }
}
