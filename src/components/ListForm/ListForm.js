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
import { AddItemForm, ListItem } from 'components'

export const formName = 'list-form'

@reduxForm({
  form: formName,
  fields: ['items', 'title']
}, mapStateToProps, mapDispatchToProps)
export default class ListForm extends Component {
  constructor (props) {
    super(props)
    this.itemsToBeAdded = []
  }

  static propTypes = {
    type: PropTypes.string.isRequired,
    changeField: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    initForm: PropTypes.func.isRequired,
    currentItems: PropTypes.array,
    itemsToBeAdded: PropTypes.array,
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
    this.props.initForm(AddItemForm.formName, { comments: '' })
    this.props.changeField(formName, 'items', JSON.stringify(itemsToBeAdded))
  }

  render () {
    const {
      handleSubmit,
      currentItems,
      title
    } = this.props
    const { itemsToBeAdded } = this
    const styles = require('./ListForm.scss')

    return (
      <form className='form-horizontal' onSubmit={handleSubmit}>
        <Grid>
          <Row>
            <Col md={10}>
              <h3 className={styles.listTitle}>{title}</h3>
            </Col>
            <Col md={2}>
              <ButtonInput bsStyle='success' onClick={handleSubmit}>
                Save List
              </ButtonInput>
            </Col>
          </Row>
          <Row>
            <Col md={2}>
              <h5>Add an item</h5>
            </Col>
            <Col md={8}>
              <AddItemForm onSubmit={this.addAndClear.bind(this)} />
            </Col>
          </Row>
          <Row>
            <Panel
                eventKey={1}
                defaultExpanded
                collapsible
                header={<h4>Items to be added <small>Click to collapse</small></h4>}
            >
            {itemsToBeAdded.length <= 0 &&
              <p>No items to be added</p>
            }
            {itemsToBeAdded.map((item, idx) =>
              <ListItem key={idx} {...item}/>
            )}
            </Panel>
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
                <ListItem key={idx} {...item}/>
              )}
            </Panel>
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
  const title = myListAndItems.title || `${name}'s Chrstmas List`
  return {
    currentItems: myListAndItems.items,
    title
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ changeField, initForm }, dispatch)
}
