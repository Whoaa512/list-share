import React, { Component, PropTypes } from 'react'
import config from 'config'
import { _notifier } from 'react-notification-system'
import { connect } from 'react-redux'
import DocumentMeta from 'react-document-meta'
import { pushState } from 'redux-router'
import { initialize } from 'redux-form'
import { ListForm } from 'components'
import { update } from 'redux/modules/lists'
import { getUserId } from 'redux/modules/auth'
import { load as loadItems } from 'redux/modules/items'

@connect(
  mapStateToProps,
  { initialize, update, loadItems, pushState })
export default class AddToList extends Component {
  static propTypes = {
    update: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    loadItems: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired
  }

  handleSubmit = (itemsToBeAdded) => {
    const data = {
      userId: this.props.userId,
      itemsToUpsert: itemsToBeAdded
    }

    return this.props.update(data)
    .then(list => {
      // load new items
      return this.props.loadItems(list.items)
    })
    .then(() => {
      _notifier.addNotification({
        position: 'tc',
        autoDismiss: 2.25,
        message: 'Item added!',
        level: 'success'
      })
    })
    .catch(error => {
      const err = new Error(error.message)
      err._error = error.message
      return Promise.reject(err)
    })
  }

  render () {
    return (
      <div className='container'>
        <h1>{/* @note: Leave an empty header for better styling */}</h1>
        <DocumentMeta title={`${config.app.title}: Add to your List`}/>
        <ListForm type='add' handleItemAdd={this.handleSubmit} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    userId: getUserId(state)
  }
}
