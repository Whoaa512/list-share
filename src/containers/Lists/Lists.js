import cloneDeep from 'lodash.clonedeep'
import config from 'config'
import get from 'lodash.get'
import React, { Component, PropTypes } from 'react'
import DocumentMeta from 'react-document-meta'
import { connect } from 'react-redux'
import { getLists } from 'redux/modules/lists'
import { getUsers } from 'redux/modules/users'
import { ListRow } from 'components'

@connect(mapStateToProps)
export default class Lists extends Component {
  static get propTypes () {
    return {
      lists: PropTypes.array.isRequired
    }
  }

  render () {
    const { lists } = this.props
    return (
      <div className='container'>
        <h1>Lists</h1>
        <DocumentMeta title={`${config.app.title}: Lists`}/>
        <ul>
          {lists.map(list =>
            <ListRow {...list} />
          )}
        </ul>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const users = getUsers(state)
  const allLists = getLists(state)
  const lists = Object.keys(allLists).map(id => {
    const list = cloneDeep(allLists[id])
    list.avatarImg = get(users, `${list.creator}.avatarImg`)
    list.link = `/list/${list.id}`
    return list
  })
  return {
    lists
  }
}
