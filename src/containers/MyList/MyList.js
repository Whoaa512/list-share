import config from 'config'
import DocumentMeta from 'react-document-meta'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Grid, Row, Col, Button } from 'react-bootstrap'
import { ListItem } from 'components'
import { getMyItems } from 'redux/modules/items'
import { userHasList } from 'redux/modules/lists'

@connect(mapStateToProps)
export default class MyList extends Component {
  static get propTypes () {
    return {
      listItems: PropTypes.array,
      userHasList: PropTypes.bool
    }
  }

  render () {
    const { userHasList, listItems } = this.props
    return (
      <div className='container'>
        <DocumentMeta title={`${config.app.title}: Lists`}/>
        <Grid>
          <Row>
            <Col xs={12} md={2}><h2>My List</h2></Col>
            <Col xs={4} xsOffset={8} md={3} mdOffset={9}>
              {userHasList &&
              <Link to='/my-list/edit'>
                <Button>Edit</Button>
              </Link>
              }
              {!userHasList &&
              <Link to='/create-list'>
                <Button>Create New List</Button>
              </Link>
              }
            </Col>
          </Row>
          {userHasList &&
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
  const listItems = getMyItems(state)
  return {
    userHasList: userHasList(state),
    listItems
  }
}
