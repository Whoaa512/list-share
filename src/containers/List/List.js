import config from 'config'
import DocumentMeta from 'react-document-meta'
import React, { Component, PropTypes } from 'react'
import { _notifier } from 'react-notification-system'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Grid, Row, Col, Button } from 'react-bootstrap'
import { ListItem } from 'components'
import { load as loadItems, getItems } from 'redux/modules/items'
import { getList, update } from 'redux/modules/lists'
import { getUserId } from 'redux/modules/auth'
import { pushState } from 'redux-router'

@connect(mapStateToProps, { update, loadItems, pushState })
export default class List extends Component {
  static get propTypes () {
    return {
      isUsersList: PropTypes.bool,
      list: PropTypes.object,
      listItems: PropTypes.array,
      loadItems: PropTypes.func,
      pushState: PropTypes.func,
      update: PropTypes.func,
      userId: PropTypes.string
    }
  }

  handleCheckbox = (item, checkedValue) => {
    const data = {
      itemsToUpsert: [{
        ...item,
        checked: checkedValue
      }]
    }
    return this.props.update(data, this.props.userId)
    .then(list => {
      return this.props.loadItems([item.id])
    })
    .then(() => {
      // @todo: add ga helpers and more tracking events throughout app
      window.ga('send', {
        hitType: 'event',
        eventCategory: 'Items',
        eventAction: `bought change: ${checkedValue}`,
        eventLabel: 'Present bought'
      })
      _notifier.addNotification({
        position: 'tc',
        autoDismiss: 3,
        message: 'Thanks!',
        level: 'success'
      })
    })
    .catch(error => {
      window.ga('send', 'exception', {
        exDescription: error.message,
        exFatal: false
      })
      _notifier.addNotification({
        position: 'tc',
        autoDismiss: 3,
        message: 'Something went wrong!',
        level: 'error'
      })
    })
  }

  render () {
    const { list, listItems, isUsersList } = this.props
    return (
      <div className='container'>
        <DocumentMeta title={`${config.app.title}: ${list.title}`}/>
        <Grid>
          <Row>
            <Col xs={12} md={4}><h2>{list.title}</h2></Col>
            <Col xs={4} xsOffset={8} md={3} mdOffset={9}>
            {/* @todo: remove these links since we redirect to /my-list now */}
            {isUsersList &&
            <Link to='/my-list/add'>
              <Button>Add New Items</Button>
            </Link>
            }
            {isUsersList &&
            <Link to='/my-list/edit'>
              <Button>Remove Items</Button>
            </Link>
            }
            {/*
              <Button>Suggest a Gift</Button>
            */}
            </Col>
          </Row>
          {listItems.length > 0 &&
          <Row ref='listItems'>
            {listItems.map((item, idx) =>
              <ListItem
                  key={idx}
                  showCheckbox={!isUsersList}
                  handleCheckbox={this.handleCheckbox}
                  item={item}
              />
            )}
          </Row>
          }
        </Grid>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const { listId } = state.router.params
  const userId = getUserId(state)
  const list = getList(state, listId)
  const allItems = getItems(state)
  const listItems = list.items.map(id => allItems[id])
  return {
    userId,
    isUsersList: list.creator === userId,
    list,
    listItems
  }
}
