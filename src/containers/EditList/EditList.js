import analytics from 'helpers/analytics'
import React, { Component, PropTypes } from 'react'
import config from 'config'
import { connect } from 'react-redux'
import DocumentMeta from 'react-document-meta'
import { _notifier } from 'react-notification-system'
import { pushState } from 'redux-router'
import { initialize } from 'redux-form'
import { ListForm } from 'components'
import { update } from 'redux/modules/lists'
import { getUserId } from 'redux/modules/auth'
import { load as loadItems } from 'redux/modules/items'

@connect(
  mapStateToProps,
  { initialize, update, loadItems, pushState })
export default class EditList extends Component {
  static propTypes = {
    update: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    initialize: PropTypes.func.isRequired,
    loadItems: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired
  }

  handleSubmit = (fieldsData) => {
    const data = {
      userId: this.props.userId,
      itemsToRemove: JSON.parse(fieldsData.itemsToRemove)
    }

    return this.props.update(data)
    .then(list => {
      analytics.send({
        hitType: 'event',
        eventCategory: 'Item',
        eventAction: 'remove',
        eventLabel: 'Items removed',
        eventValue: data.itemsToRemove.length
      })
      return list
    })
    .then(list => {
      // load new items
      return this.props.loadItems(list.items)
    })
    .then(() => this.props.pushState(null, '/my-list'))
    .then(() => {
      _notifier.addNotification({
        position: 'tc',
        autoDismiss: 3,
        message: 'Items removed!',
        level: 'success'
      })
    })
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
        <h1>{/* @note: Leave an empty header for better styling */}</h1>
        <DocumentMeta title={`${config.app.title}: Remove items from your List`}/>
        <ListForm type='remove' onSubmit={this.handleSubmit} history={this.props.history}/>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    userId: getUserId(state)
  }
}
