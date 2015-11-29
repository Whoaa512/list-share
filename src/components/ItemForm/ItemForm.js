import React, { Component, PropTypes } from 'react'
import { Panel, Row } from 'react-bootstrap'
import { reduxForm, initialize } from 'redux-form'
import { Input, Button, ButtonToolbar } from 'react-bootstrap'
import { ListItem } from 'components'
import itemValidation from './itemValidation'

export const formName = 'item-form'

@reduxForm({
  form: formName,
  fields: ['title', 'imageUrl', 'link', 'comments'],
  validate: itemValidation
})
export default class ItemForm extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    itemToEdit: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    resetText: PropTypes.string,
    submitStyle: PropTypes.string,
    submitText: PropTypes.string,
    type: PropTypes.string
  }

  componentDidMount () {
    const {
      dispatch,
      itemToEdit,
      type
    } = this.props
    if (type === 'edit' && itemToEdit != null) {
      dispatch(initialize(formName, {
        comments: itemToEdit.comments,
        imageUrl: itemToEdit.imageUrl,
        link: itemToEdit.link,
        title: itemToEdit.title
      }))
    }
  }

  reset () {
    const { dispatch } = this.props
    dispatch(initialize(formName, {}))
  }

  render () {
    const styles = require('./ItemForm.scss')
    const {
      fields: { title, imageUrl, link, comments },
      handleSubmit,
      resetText = 'Clear',
      submitStyle = 'primary',
      submitText = 'Add',
      type
    } = this.props

    const isEditing = type === 'edit'
    let previewItem
    if (isEditing) {
      previewItem = {
        title: title.value,
        imageUrl: imageUrl.value,
        link: link.value,
        comments: comments.value
      }
    }

    const renderInput = (type, field, label) => {
      const error = field.error && field.touched && <div className='text-danger'>{field.error}</div>
      return <Input type={type} label={label} addonAfter={error} {...field} />
    }

    return (
      <div className='form-horizontal'>
        <Row>
          {renderInput('text', title, 'Item Title')}
          {renderInput('text', imageUrl, 'Image Link')}
          {renderInput('text', link, 'Purchase or Info Link')}
          {renderInput('textarea', comments, 'Additional comments')}
        </Row>
        <Row>
          <ButtonToolbar>
            <Button type='button' bsStyle={submitStyle} onClick={handleSubmit}>
              {submitText}
            </Button>
            <Button type='reset' onClick={this.reset.bind(this)}>
              {resetText}
            </Button>
          </ButtonToolbar>
        </Row>
        {isEditing &&
        <Row className={styles.itemPreview}>
          <Panel
              defaultExpanded
              header={<h4>Preview:</h4>}
          >
            <ListItem {...previewItem} />
          </Panel>
        </Row>
        }
      </div>
    )
  }
}

ItemForm.formName = formName
