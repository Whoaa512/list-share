import get from 'lodash.get'
import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import {
  change as changeField,
  reduxForm,
  initialize as initForm
} from 'redux-form'
import { Grid, Row, Col, ButtonInput, Panel } from 'react-bootstrap'
import { getUser } from 'redux/modules/auth'
import { AddItemForm, ListItem } from 'components'

export const formName = 'create-list'

@reduxForm({
  form: formName,
  fields: ['items', 'title']
}, mapStateToProps, mapDispatchToProps)
export default class CreateListForm extends Component {
  constructor (props) {
    super(props)
    this.itemsToBeAdded = []
  }

  static propTypes = {
    changeField: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    initForm: PropTypes.func.isRequired,
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
      title
    } = this.props
    const { itemsToBeAdded } = this
    const styles = require('./CreateListForm.scss')

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
          {itemsToBeAdded.length > 0 && <Row>
            <Panel header={<h4>Items to be added</h4>}>
              {itemsToBeAdded.map((item, idx) =>
                <ListItem key={idx} {...item}/>
              )}
            </Panel>
          </Row>}
        </Grid>
      </form>
    )
  }
}

CreateListForm.formName = formName

function mapStateToProps (state) {
  const user = getUser(state)
  const [name] = get(user, 'name', 'Anon').split(' ')
  return {
    title: `${name}'s Chrstmas List`
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ changeField, initForm }, dispatch)
}
