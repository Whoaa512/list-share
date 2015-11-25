import ApiError from 'utils/ApiError'
import isEmpty from 'lodash/lang/isEmpty'
import { getUser } from './users/load'

export default function validateEmail (req, params) {
  const [ email ] = params
  console.log('wtf email', typeof email)

  if (isEmpty(email)) {
    return Promise.reject(new ApiError('Missing email'))
  }

  const existingUser = getUser(email)
  console.log('existingUser', existingUser)

  if (existingUser != null) {
    return Promise.reject(new ApiError('Email address already used'))
  }

  return Promise.resolve({ message: 'Email is valid' })
}
