import React, { Component, PropTypes } from 'react'
import { client } from 'helpers/ApiClient'
import { reduxForm } from 'redux-form'
import signUpValidation from './signUpValidation'

function asyncValidate (data) {
  if (!data.email) {
    return Promise.resolve({})
  }
  return new Promise((resolve, reject) => {
    const errors = {}

    client.get(`/validateEmail/${data.email}`)
    .then(() => {
      // Email is valid
      resolve({})
    })
    .catch(error => {
      errors.email = error.message
      reject(errors)
    })
  })
}

export const formName = 'sign-up'

@reduxForm({
  form: formName,
  fields: ['name', 'email', 'password'],
  validate: signUpValidation,
  asyncValidate,
  asyncBlurFields: ['email']
})
export default class SignUpForm extends Component {
  static propTypes = {
    asyncValidating: PropTypes.bool.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired
  }

  render () {
    const {
      asyncValidating,
      fields: { name, email, password },
      handleSubmit,
      resetForm
    } = this.props
    const styles = require('./SignUpForm.scss')
    const renderInput = (field, label, showAsyncValidating, type = 'text') =>
      <div className={'form-group' + (field.error && field.touched ? ' has-error' : '')}>
        <label htmlFor={field.name} className='col-sm-2'>{label}</label>
        <div className={`col-sm-8 ${styles.inputGroup}`}>
          {showAsyncValidating && asyncValidating && <i className={'fa fa-cog fa-spin ' + styles.cog}/>}
          <input type={type} className='form-control' id={field.name} {...field}/>
          {field.error && field.touched && <div className='text-danger'>{field.error}</div>}
        </div>
      </div>

    return (
      <div>
        <form className='form-horizontal' onSubmit={handleSubmit}>
          {renderInput(name, 'Full Name')}
          {renderInput(email, 'Email', true, 'email')}
          {renderInput(password, 'Password', false, 'password')}
          <div className='form-group'>
            <div className='col-sm-offset-2 col-sm-10'>
              <button className='btn btn-success' onClick={handleSubmit}>
                <i className='fa fa-paper-plane'/> Submit
              </button>
              <button className='btn btn-warning' onClick={resetForm} style={{marginLeft: 15}}>
                <i className='fa fa-undo'/> Reset
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

SignUpForm.formName = formName
