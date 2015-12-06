import analytics from 'helpers/analytics'
import config from 'config'
import DocumentMeta from 'react-document-meta'
import React, { Component, PropTypes } from 'react'
import { _notifier } from 'react-notification-system'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Grid, Row, Col, Button } from 'react-bootstrap'
import { ListItem } from 'components'
import { getItems, update as updateItem } from 'redux/modules/items'
import { getList } from 'redux/modules/lists'
import { getUserId } from 'redux/modules/auth'
import { pushState } from 'redux-router'

@connect(mapStateToProps, { updateItem, pushState })
export default class List extends Component {
  static get propTypes () {
    return {
      isUsersList: PropTypes.bool,
      list: PropTypes.object,
      listItems: PropTypes.array,
      pushState: PropTypes.func,
      updateItem: PropTypes.func,
      userId: PropTypes.string
    }
  }

  handleCheckbox = (item, checkedValue) => {
    const data = {
      ...item,
      checked: checkedValue,
      checkedBy: checkedValue ? this.props.userId : ''
    }
    return this.props.updateItem(data)
    .then(() => {
      analytics.send({
        hitType: 'event',
        eventCategory: 'Item',
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
    .catch(() => {
      _notifier.addNotification({
        position: 'tc',
        autoDismiss: 3,
        message: 'Something went wrong!',
        level: 'error'
      })
    })
  }

  render () {
    const {
      list,
      listItems,
      isUsersList,
      userId
    } = this.props
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
                  currentUser={userId}
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
