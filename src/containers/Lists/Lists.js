import cloneDeep from 'lodash.clonedeep'
import config from 'config'
import get from 'lodash.get'
import React, { Component, PropTypes } from 'react'
import DocumentMeta from 'react-document-meta'
import { Link } from 'react-router'
import { Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { getLists, userHasList } from 'redux/modules/lists'
import { getUsers } from 'redux/modules/users'
import { getUserId } from 'redux/modules/auth'
import { ListRow } from 'components'

@connect(mapStateToProps)
export default class Lists extends Component {
  static get propTypes () {
    return {
      lists: PropTypes.array.isRequired,
      userHasList: PropTypes.bool.isRequired
    }
  }

  render () {
    const { lists } = this.props
    return (
      <div className='container'>
        <h1>{/* @todo: fix this; Leave an empty header for better styling */}</h1>
        <DocumentMeta title={`${config.app.title}: Lists`}/>
        {lists.length <= 0 &&
        <div>
          <h4>No lists yet. Let's create the first!</h4>
          <Link to='/create-list'>
            <Button>Create New List</Button>
          </Link>
        </div>
        }
        {!userHasList &&
        /* @todo: refactor all links to their own module */
        <Link to='/create-list'>
          <Button>Create Your List</Button>
        </Link>
        }
        <ul>
          {lists.map((list, idx) =>
            <ListRow key={idx} {...list} />
          )}
        </ul>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const users = getUsers(state)
  const userId = getUserId(state)
  const allLists = getLists(state)
  const lists = Object.keys(allLists).map(id => {
    const list = cloneDeep(allLists[id])
    list.avatarImg = get(users, `${list.creator}.avatarImg`)
    list.link = `/list/${list.id}`
    if (userId === list.creator) {
      list.link = `/my-list`
    }
    return list
  })
  return {
    lists,
    userHasList: userHasList(state)
  }
}
