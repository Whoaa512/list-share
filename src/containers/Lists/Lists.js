import config from 'config'
import React, { Component } from 'react'
import DocumentMeta from 'react-document-meta'
import { ListRow } from 'components'

export default class Lists extends Component {

  render () {
    return (
      <div className='container'>
        <h1>Lists</h1>
        <DocumentMeta title={`${config.app.title}: Lists`}/>
        <ul>
          <ListRow
              avatarImg='https://avatars1.githubusercontent.com/u/170270?v=3&s=60'
              link='/list/:listId'
              title="Alice's Christmas List"
          />
        </ul>
      </div>
    )
  }
}
