import React, { Component, PropTypes } from 'react'
import { reduxForm, initialize } from 'redux-form'
import { Input, Button, ButtonToolbar } from 'react-bootstrap'
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
    handleSubmit: PropTypes.func.isRequired,
    resetText: PropTypes.string,
    submitText: PropTypes.string,
    type: PropTypes.string
  }

  reset () {
    const { dispatch } = this.props
    dispatch(initialize(formName, {}))
  }

  render () {
    const {
      fields: { title, imageUrl, link, comments },
      handleSubmit,
      resetText = 'Clear',
      submitText = 'Add',
      type
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

ItemForm.formName = formName
