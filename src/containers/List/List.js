import config from 'config'
import DocumentMeta from 'react-document-meta'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col, Button } from 'react-bootstrap'
import { ListItem } from 'components'
import { getItems } from 'redux/modules/items'
import { getList } from 'redux/modules/lists'

@connect(mapStateToProps)
export default class List extends Component {
  static get propTypes () {
    return {
      list: PropTypes.object,
      listItems: PropTypes.array
    }
  }

  render () {
    const { list, listItems } = this.props
    return (
      <div className='container'>
        <DocumentMeta title={`${config.app.title}: ${list.title}`}/>
        <Grid>
          <Row>
            <Col xs={12} md={4}><h2>{list.title}</h2></Col>
            <Col xs={4} xsOffset={8} md={3} mdOffset={9}>
              <Button>Suggest a Gift</Button>
            </Col>
          </Row>
          {listItems.length > 0 &&
          <Row ref='listItems'>
            {listItems.map(item =>
              <ListItem {...item} />
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
  const list = getList(state, listId)
  const allItems = getItems(state)
  const listItems = list.items.map(id => allItems[id])
  return {
    list,
    listItems
  }
}
