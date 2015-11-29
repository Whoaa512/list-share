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
  let lists = getLists(state)
  lists = Object.keys(lists).map(x => {
    const list = lists[x]
    list.avatarImg = get(users, list.creator)
    list.link = `/list/${list.id}`
    return list
  })
  return {
    lists
  }
}
