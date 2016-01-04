import config from 'config'
import DocumentMeta from 'react-document-meta'
import isEmpty from 'lodash.isempty'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-bootstrap'
import { LinkButton, ListItem } from 'components'
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
    const styles = require('./MyList.scss')
    return (
      <div className='container'>
        <h1>{/* @note: Leave an empty header for better styling */}</h1>
        <DocumentMeta title={`${config.app.title}: My List`}/>
        <Grid>
          <Row>
            <Col className={styles.buttons} xs={12} md={3} mdOffset={9}>
              {userHasList &&
              <LinkButton
                  bsStyle='primary'
                  to='/my-list/add'
                  buttonText='Add New Items'
              />
              }
              {userHasList && !isEmpty(listItems) &&
              <LinkButton
                  to='/my-list/remove'
                  buttonText='Remove Items'
              />
              }
              {!userHasList &&
              <LinkButton
                  bsStyle='primary'
                  to='/create-list'
                  buttonText='Create New List'
              />
              }
            </Col>
          </Row>
          {userHasList &&
          <Row ref='listItems'>
            {listItems.map((item, idx) =>
              <ListItem key={idx} showEdit item={item} />
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
