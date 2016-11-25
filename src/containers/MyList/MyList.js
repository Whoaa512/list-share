import config from 'config'
import DocumentMeta from 'react-document-meta'
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
            <Col className={styles.buttons} xs={12} md={2} mdOffset={10}>
              {userHasList &&
              <LinkButton
                  bsStyle='primary'
                  to='/my-list/add'
                  buttonText='Add New Items'
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
              <ListItem key={idx} showEdit showArchive item={item} />
            )}
          </Row>
          }
        </Grid>
      </div>
    )
  }
}

function excludeArchived (item) {
  return item && item.archivedAt == null
}
function mapStateToProps (state) {
  const listItems = getMyItems(state).filter(excludeArchived)
  return {
    userHasList: userHasList(state),
    listItems
  }
}
