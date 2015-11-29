import compact from 'lodash.compact'
import get from 'lodash.get'
import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import {
  change as changeField,
  reduxForm,
  initialize as initForm
} from 'redux-form'
import { Grid, Row, Col, ButtonInput, Panel } from 'react-bootstrap'
import { getMyListAndItems } from 'redux/modules/lists'
import { getUser } from 'redux/modules/auth'
import { ItemForm, ListItem } from 'components'

export const formName = 'list-form'

@reduxForm({
  form: formName,
  fields: ['itemsToBeAdded', 'itemsToRemove', 'title']
}, mapStateToProps, mapDispatchToProps)
export default class ListForm extends Component {
  constructor (props) {
    super(props)
    this.itemsToBeAdded = []
    this.itemsToRemove = []
  }

  static propTypes = {
    type: PropTypes.string.isRequired,
    changeField: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    initForm: PropTypes.func.isRequired,
    currentItems: PropTypes.array,
    title: PropTypes.string
  }

  componentDidMount () {
    const { initForm, title } = this.props
    initForm(formName, {
      title
    })
  }

  addAndClear (data) {
    const { itemsToBeAdded } = this
    itemsToBeAdded.push(data)
    this.props.initForm(ItemForm.formName, { comments: '' })
    this.props.changeField(formName, 'itemsToBeAdded', JSON.stringify(itemsToBeAdded))
  }

  removeSaved (item) {
    const { itemsToRemove } = this
    itemsToRemove.push(item)
    this.props.changeField(formName, 'itemsToRemove', JSON.stringify(itemsToRemove))
  }

  removeUnSaved (idx) {
    this.itemsToBeAdded[idx] = undefined
    this.itemsToBeAdded = compact(this.itemsToBeAdded)
    this.props.changeField(formName, 'itemsToBeAdded', JSON.stringify(this.itemsToBeAdded))
  }

  render () {
    const {
      handleSubmit,
      currentItems,
      type,
      title
    } = this.props
    const { itemsToBeAdded, itemsToRemove } = this
    const styles = require('./ListForm.scss')
    const saveButton = (saveText, style = 'success') => {
      return (
        <div className='text-center'>
          <ButtonInput
              bsSize='large'
              bsStyle={style}
              onClick={handleSubmit}
              type='submit'
          >
            {saveText}
          </ButtonInput>
        </div>
      )
    }

    return (
      <form className='form-horizontal' onSubmit={handleSubmit}>
        <Grid>
          <Row>
            <h3 className={styles.listTitle}>{title}</h3>
          </Row>
          {(type === 'add' || type === 'create') &&
          <Row>
            <Col md={8} mdOffset={2}>
              <h5>Add an item to draft</h5>
              <ItemForm type='add' submitText='Add to draft' onSubmit={this.addAndClear.bind(this)} />
            </Col>
          </Row>
          }
          <Row>
            {(type === 'add' || type === 'create') &&
            <Panel
                eventKey={1}
                defaultExpanded
                header={<h4>Items to be added</h4>}
            >
            {itemsToBeAdded.length >= 2 && saveButton('Add Items to My List')}
            {itemsToBeAdded.length <= 0 &&
              <p>No items to be added</p>
            }
            {itemsToBeAdded.map((item, idx) =>
              <ListItem remove={this.removeUnSaved.bind(this, idx)} key={idx} {...item}/>
            )}
            {itemsToBeAdded.length > 0 && saveButton('Add Items to My List')}
            </Panel>
            }
            {type === 'edit' &&
            <Panel
                eventKey={2}
                defaultExpanded
                collapsible
                header={<h4>Items in list <small>Click to collapse</small></h4>}
            >
              {currentItems.length <= 0 &&
                <p>No items added yet</p>
              }
              {currentItems.map((item, idx) =>
                !itemsToRemove.some(removed => item.id === removed.id) &&
                <ListItem remove={this.removeSaved.bind(this, item)} key={idx} {...item}/>
              )}
            </Panel>
            }
            {type === 'edit' && itemsToRemove.length > 0 &&
            <Panel
                eventKey={3}
                defaultExpanded
                collapsible
                header={<h4>Items to be removed <small>Click to collapse</small></h4>}
            >
              {itemsToRemove.length >= 2 && saveButton('Confirm removals and update your list', 'danger')}
              {itemsToRemove.map((item, idx) =>
                <ListItem key={idx} {...item}/>
              )}
              {itemsToRemove.length > 0 && saveButton('Confirm removals and update your list', 'danger')}
            </Panel>
            }
          </Row>
        </Grid>
      </form>
    )
  }
}

ListForm.formName = formName

function mapStateToProps (state) {
  const user = getUser(state)
  const [name] = get(user, 'name', 'Anon').split(' ')
  const myListAndItems = getMyListAndItems(state)
  const title = myListAndItems.title || `${name}'s Christmas List`
  return {
    currentItems: myListAndItems.items,
    title
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ changeField, initForm }, dispatch)
}
