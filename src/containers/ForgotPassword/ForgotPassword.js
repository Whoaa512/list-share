import React, { Component, PropTypes } from 'react'
import { _notifier } from 'react-notification-system'
import { client } from 'helpers/ApiClient'
import { reduxForm } from 'redux-form'
import forgotPasswordValidation from './forgotPasswordValidation'

function asyncValidate (data) {
  if (!data.email) {
    return Promise.resolve({})
  }
  return new Promise((resolve, reject) => {
    const errors = {}

    client.get(`/validateEmail/${data.email}`)
    .then(() => {
      // Email is valid
      errors.email = 'Email does not have an account yet.'
      reject(errors)
    })
    .catch(() => {
      resolve({})
    })
  })
}

export const formName = 'sign-up'

@reduxForm({
  form: formName,
  fields: ['email'],
  validate: forgotPasswordValidation,
  asyncValidate,
  asyncBlurFields: ['email']
})
export default class ForgotPassword extends Component {
  static propTypes = {
    asyncValidating: PropTypes.bool.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  }

  onSubmit = (data) => {
    const { email } = data
    client.post('/forgot', { data: { email } })
    .then(result => {
      console.log('wtf', result)
      _notifier.addNotification({
        position: 'tc',
        autoDismiss: 5,
        message: 'Check your inbox for a password reset message.',
        level: 'success'
      })
    })
    .catch(error => {
      const err = new Error(error.message)
      err._error = error.message
      return Promise.reject(err)
    })
  }

  render () {
    const {
      asyncValidating,
      fields: { email },
      handleSubmit,
      history
    } = this.props
    const handleClick = (e) => {
      e.preventDefault()
      history.goBack()
      return
    }
    const styles = require('./ForgotPassword.scss')
    const renderInput = (field, label, showAsyncValidating, type = 'text') =>
      <div className={'form-group' + (field.error && field.touched ? ' has-error' : '')}>
        <div className={`col-xs-offset-2 col-xs-8 col-sm-8 col-md-offset-4 col-md-4 ${styles.inputGroup}`}>
          {showAsyncValidating && asyncValidating && <i className={'fa fa-cog fa-spin ' + styles.cog}/>}
          <input placeholder={label} type={type} className='form-control' id={field.name} {...field}/>
          {field.error && field.touched && <div className='text-danger'>{field.error}</div>}
        </div>
      </div>

    return (
      <div className='text-center'>
        <h5>Forgot password reset</h5>
        <form className='form-horizontal' onSubmit={handleSubmit(this.onSubmit)}>
          {renderInput(email, 'Email', true)}
          <div className='form-group'>
            <div className='col-xs-offset-1 col-xs-10 col-sm-offset-2 col-sm-10 col-md-offset-2 col-md-6'>
              <button className='btn btn-success' onClick={handleSubmit(this.onSubmit)}>
                Submit
              </button>
              <a className='link' onClick={handleClick} style={{marginLeft: 15}}>
                Cancel
              </a>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

ForgotPassword.formName = formName
