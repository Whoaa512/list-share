import analytics from 'helpers/analytics'
import config from 'config'
import DocumentMeta from 'react-document-meta'
import get from 'lodash.get'
import * as notifier from 'helpers/notifier'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Input, Grid, Row, Col } from 'react-bootstrap'
import { ListItem } from 'components'
import { getItems, update as updateItem } from 'redux/modules/items'
import { getList } from 'redux/modules/lists'
import { getUserId } from 'redux/modules/auth'
import { update as updateListMeta, getData as getListMeta } from 'redux/modules/listMeta'
import { pushState } from 'redux-router'

@connect(mapStateToProps, { updateItem, pushState, updateListMeta })
export default class List extends Component {
  static get propTypes () {
    return {
      isUsersList: PropTypes.bool,
      list: PropTypes.object,
      listItems: PropTypes.array,
      listMarkedAsBought: PropTypes.bool,
      pushState: PropTypes.func,
      updateItem: PropTypes.func,
      updateListMeta: PropTypes.func,
      userId: PropTypes.string
    }
  }

  handleCheckbox (item, checkedValue) {
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
      notifier.success()
    })
    .catch(() => notifier.error())
  }

  markListAsBought (listId) {
    const checkedValue = this.refs.markList.getChecked()
    return this.props.updateListMeta({
      [listId]: {
        boughtNonListPresent: checkedValue
      }
    })
    .then(() => {
      analytics.send({
        hitType: 'event',
        eventCategory: 'Item',
        eventLabel: 'Non-List Present bought'
      })
      notifier.success()
    })
    .catch(() => notifier.error())
  }

  render () {
    const {
      list,
      listItems,
      listMarkedAsBought,
      isUsersList,
      userId
    } = this.props
    return (
      <div className='container'>
        <DocumentMeta title={`${config.app.title}: ${list.title}`}/>
        <Grid>
          <Row>
            <Col xs={12} md={4}><h2>{list.title}</h2></Col>
          </Row>
          <Row>
            <Col className='pull-right'>
              <Input
                  defaultChecked={listMarkedAsBought}
                  label='Bought non-list present'
                  onChange={() => this.markListAsBought(list.id)}
                  ref='markList'
                  type='checkbox'
              />
            </Col>
          </Row>
          {listItems.length > 0 &&
          <Row ref='listItems'>
            {listItems.map((item, idx) =>
              <ListItem
                  key={idx}
                  currentUser={userId}
                  showCheckbox={!isUsersList}
                  handleCheckbox={this.handleCheckbox.bind(this)}
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
  const listMeta = getListMeta(state)
  const listItems = list.items.map(id => allItems[id])
  const listMarkedAsBought = get(listMeta, `${listId}.boughtNonListPresent`, false)
  return {
    userId,
    isUsersList: list.creator === userId,
    list,
    listMarkedAsBought,
    listItems
  }
}
