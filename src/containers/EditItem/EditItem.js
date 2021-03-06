import analytics from 'helpers/analytics'
import config from 'config'
import DocumentMeta from 'react-document-meta'
import React, { Component, PropTypes } from 'react'
import find from 'lodash/find'
import { _notifier } from 'react-notification-system'
import { Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import { getUserId } from 'redux/modules/auth'
import { initialize } from 'redux-form'
import { ItemForm } from 'components'
import { load as loadItems, getMyItems } from 'redux/modules/items'
import { pushState } from 'redux-router'
import { update } from 'redux/modules/lists'

@connect(
  mapStateToProps,
  { initialize, update, loadItems, pushState })
export default class EditList extends Component {
  static propTypes = {
    initialize: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    itemToEdit: PropTypes.object.isRequired,
    loadItems: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired
  }

  handleSubmit = (updatedValues) => {
    const { itemToEdit } = this.props
    const updatedItem = {
      ...itemToEdit,
      ...updatedValues
    }
    const data = {
      userId: this.props.userId,
      itemsToUpsert: [updatedItem]
    }

    return this.props.update(data)
    .then(list => {
      analytics.send({
        hitType: 'event',
        eventCategory: 'Item',
        eventAction: 'edit',
        eventLabel: 'Item updated',
        eventValue: 1
      })
      return list
    })
    .then(list => {
      // load new items
      return this.props.loadItems([itemToEdit.id])
    })
    .then(() => this.props.pushState(null, '/my-list'))
    .then(() => {
      _notifier.addNotification({
        position: 'tc',
        autoDismiss: 3,
        message: 'Item updated!',
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
    const { itemToEdit } = this.props
    return (
      <div className='container'>
        <h1></h1>
        <DocumentMeta title={`${config.app.title}: Edit your item`}/>
        <Col xs={10} xsOffset={1}>
          <ItemForm
              type='edit'
              showPreview
              submitText='Save'
              submitStyle='success'
              handleCancel={() => this.props.history.goBack()}
              itemToEdit={itemToEdit}
              onSubmit={this.handleSubmit}
          />
        </Col>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const { itemId } = state.router.params
  const myItems = getMyItems(state)
  const itemToEdit = find(myItems, { id: itemId })
  return {
    itemToEdit,
    userId: getUserId(state)
  }
}
