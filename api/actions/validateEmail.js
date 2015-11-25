import ApiError from 'utils/ApiError'
import isEmpty from 'lodash.isempty'
import { getUser } from './users/load'

export default function validateEmail (req, params) {
  return new Promise((resolve, reject) => {
    const [ email ] = params

    if (isEmpty(email)) {
      return reject(new ApiError('Missing email'))
    }

    const existingUser = getUser(email)

    if (existingUser != null) {
      return reject(new ApiError('Email address already used'))
    }

    return resolve({ message: 'Email is valid' })
  })
}
