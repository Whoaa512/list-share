import React, { Component, PropTypes } from 'react'
import { reduxForm, reset as resetForm } from 'redux-form'
import { Input, Button, ButtonToolbar } from 'react-bootstrap'
import addItemValidation from './addItemValidation'

export const formName = 'add-item'

@reduxForm({
  form: formName,
  fields: ['title', 'imageUrl', 'link', 'comments'],
  initialValues: {
    imageUrl: 'https://d1luk0418egahw.cloudfront.net/static/images/guide/NoImage_592x444.jpg'
  },
  validate: addItemValidation
}, undefined, { resetForm })
export default class AddItemForm extends Component {
  static propTypes = {
    resetForm: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetText: PropTypes.string,
    submitText: PropTypes.string
  }

  reset () {
    const { resetForm } = this.props
    resetForm(formName)
  }

  render () {
    const {
      fields: { title, imageUrl, link, comments },
      handleSubmit,
      resetText = 'Clear',
      submitText = 'Add'
    } = this.props

    const renderInput = (type, field, label) => {
      const error = field.error && field.touched && <div className='text-danger'>{field.error}</div>
      return <Input type={type} label={label} addonAfter={error} {...field} />
    }

    return (
      <div className='form-horizontal'>
        {renderInput('text', title, 'Item Title')}
        {renderInput('text', imageUrl, 'Image Link')}
        {renderInput('text', link, 'Purchase or Info Link')}
        {renderInput('textarea', comments, 'Additional comments')}
        <ButtonToolbar>
          <Button type='button' bsStyle='primary' onClick={handleSubmit}>
            {submitText}
          </Button>
          <Button type='reset' onClick={this.reset.bind(this)}>
            {resetText}
          </Button>
        </ButtonToolbar>
      </div>
    )
  }
}

AddItemForm.formName = formName

