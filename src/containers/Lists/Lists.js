import cloneDeep from 'lodash.clonedeep'
import config from 'config'
import get from 'lodash.get'
// @todo: fix to use full lodash everywhere
import some from 'lodash/collection/some'
import React, { Component, PropTypes } from 'react'
import DocumentMeta from 'react-document-meta'
import { connect } from 'react-redux'
import { getLists, userHasList } from 'redux/modules/lists'
import { getListItems } from 'redux/modules/items'
import { getUsers } from 'redux/modules/users'
import { getUserId } from 'redux/modules/auth'
import { LinkButton, ListRow } from 'components'

@connect(mapStateToProps)
export default class Lists extends Component {
  static get propTypes () {
    return {
      lists: PropTypes.array.isRequired,
      userHasList: PropTypes.bool.isRequired
    }
  }

  render () {
    const { lists, userHasList } = this.props
    return (
      <div className='container'>
        <h3>
          All lists

          {userHasList &&
          <LinkButton
              bsStyle='primary'
              className='pull-right'
              to='/my-list/add'
              buttonText='Add items to your list'
          />
          }

          {!userHasList &&
          <LinkButton
              bsStyle='primary'
              className='pull-right'
              to='/create-list'
              buttonText='Create your list'
          />
          }
        </h3>
        <DocumentMeta title={`${config.app.title}: Lists`}/>

        {lists.length <= 0 &&
        <div>
          <h4>No lists yet. Let's create the first!</h4>
          <LinkButton
              bsStyle='primary'
              to='/create-list'
              buttonText='Create your list'
          />
        </div>
        }
        <ul className='list-unstyled'>
          {lists.map((list, idx) =>
            (list && <ListRow key={idx} {...list} />)
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
  const isBoughtByUser = item => item.checkedBy === userId
  const lists = Object.keys(allLists).map(id => {
    const list = cloneDeep(allLists[id])
    if (list.items.length <= 0) {
      return false
    }
    list.avatarImg = get(users, `${list.creator}.avatarImg`)
    list.link = `/list/${list.id}`
    if (userId === list.creator) {
      list.link = `/my-list`
    }
    list.anyPresentBought = some(getListItems(state, list.id), isBoughtByUser)
    return list
  })
  return {
    lists,
    userHasList: userHasList(state)
  }
}
