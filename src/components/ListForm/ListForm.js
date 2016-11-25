import compact from 'lodash/compact'
import get from 'lodash/get'
import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import {
  change as changeField,
  reduxForm,
  initialize as initForm
} from 'redux-form'
import { Grid, Row, Col, Button, Panel } from 'react-bootstrap'
import { Divider } from 'pui-react-dividers'
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
    handleItemAdd: PropTypes.func,
    handleSubmit: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
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
    this.props.handleItemAdd([data])
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

  undoRemoveSaved (idx) {
    this.itemsToRemove[idx] = undefined
    this.itemsToRemove = compact(this.itemsToRemove)
    this.props.changeField(formName, 'itemsToRemove', JSON.stringify(this.itemsToRemove))
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
    const saveText = type === 'remove' ? 'Confirm removals' : 'Create My List'
    const saveButton = (saveText, style = 'success', cancel) => {
      return (
        <div className='text-center'>
          <Button
              bsSize='large'
              bsStyle={style}
              onClick={handleSubmit}
              type='submit'
          >
            {saveText}
          </Button>
          {cancel &&
          <Button
            bsStyle='link'
            onClick={() => this.props.history.goBack()}
          >
            Cancel
          </Button>
          }
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
            <Col xs={10} xsOffset={1}>
              <h5>{type === 'create' ? 'Add items to list preview' : ''}</h5>
              <ItemForm
                  type='add'
                  showPreview
                  submitStyle={type === 'create' ? null : 'success'}
                  submitText={type === 'create' ? 'Add to list preview' : 'Add to list'}
                  onSubmit={this.addAndClear.bind(this)}
              />
            </Col>
          </Row>
          }
          <Row>
            {itemsToRemove.length > 0 && saveButton(saveText, 'danger', true)}
            {(type === 'add' || type === 'create') &&
            <Panel
                className={styles.panelPadding}
                eventKey={1}
                defaultExpanded
                header={<h4>Items {type === 'create' ? 'to be ' : ''}added</h4>}
            >
            {itemsToBeAdded.length >= 2 && type === 'create' && saveButton(saveText)}
            {itemsToBeAdded.length <= 0 &&
              <p>No items {type === 'create' ? 'to be ' : ''}added</p>
            }
            {itemsToBeAdded.map((item, idx) =>
              <ListItem remove={this.removeUnSaved.bind(this, idx)} key={idx} item={item}/>
            )}
            {itemsToBeAdded.length > 0 && type === 'create' && saveButton(saveText)}
            </Panel>
            }
            {type === 'remove' &&
            <Panel
                className={styles.panelPadding}
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
                <ListItem remove={this.removeSaved.bind(this, item)} key={idx} item={item}/>
              )}
            </Panel>
            }
            {type === 'remove' && itemsToRemove.length > 0 &&
            <Panel
                className={styles.panelPadding}
                eventKey={3}
                defaultExpanded
                collapsible
                header={<h4>Items to be removed <small>Click to collapse</small></h4>}
            >
              {itemsToRemove.length > 0 && saveButton(saveText, 'danger', true)}
              <Divider/>
              {itemsToRemove.map((item, idx) =>
                <ListItem remove={this.undoRemoveSaved.bind(this, idx)} key={idx} item={item}/>
              )}
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
