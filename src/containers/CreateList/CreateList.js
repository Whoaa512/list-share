import React, { Component, PropTypes } from 'react'
import get from 'lodash.get'
import config from 'config'
import { connect } from 'react-redux'
import DocumentMeta from 'react-document-meta'
import { initialize } from 'redux-form'
import { CreateListForm } from 'components'
import { create } from 'redux/modules/lists'
import { getUser } from 'redux/modules/auth'

@connect(
  mapStateToProps,
  { initialize, create })
export default class CreateList extends Component {
  static propTypes = {
    create: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired
  }

  handleSubmit = (data) => {
    data.items = JSON.parse(data.items)

    return this.props.create(data, this.props.userId)
    .then(list => {
      // @todo: tell the user they were successful
      //    also redirect them somewhere to see their created list

      // @note: have to use old school way to reset since reset was buggy
      return this.props.initialize(CreateListForm.formName, {})
    })
    .catch(error => {
      const errors = {
        _error: error.message
      }
      throw errors
    })
  }

  render () {
    return (
      <div className='container'>
        <h1>{/* @todo: fix this; Leave an empty header for better styling */}</h1>
        <DocumentMeta title={`${config.app.title}: Create a List`}/>
        <CreateListForm onSubmit={this.handleSubmit} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  const user = getUser(state)
  const userId = get(user, 'id', '')
  return {
    userId
  }
}
