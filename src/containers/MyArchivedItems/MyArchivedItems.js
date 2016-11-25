import config from 'config'
import DocumentMeta from 'react-document-meta'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Grid, Row } from 'react-bootstrap'
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
        <h1>{/* @note: Leave an empty header for better styling */}</h1>
        <DocumentMeta title={`${config.app.title}: My List`}/>
        <Grid>
          {userHasList &&
          <Row ref='listItems'>
            {listItems.map((item, idx) =>
              <ListItem key={idx} item={item} />
            )}
          </Row>
          }
        </Grid>
      </div>
    )
  }
}

function onlyArchived (item) {
  return item && item.archivedAt != null
}
function mapStateToProps (state) {
  const listItems = getMyItems(state).filter(onlyArchived)
  return {
    userHasList: userHasList(state),
    listItems
  }
}
