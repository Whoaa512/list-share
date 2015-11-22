import ApiError from 'utils/ApiError'
import bcrypt, { cryptoCatch } from 'utils/bcrypt-as-promised'
import pick from 'lodash.pick'
import { default as loadUser } from './users/load'

export default function login (req) {
  const {
    email,
    password
  } = req.body

  if (email == null || password == null) {
    return Promise.reject(new ApiError('Missing email, password'))
  }

  return loadUser(req)
  .then(user => {
    const isValidPassword = bcrypt.compareAsync(password, user.passwordHash)
    .catch(cryptoCatch(user.id))
    return [user, isValidPassword]
  })
  .spread((user, isValidPassword) => {
    if (!isValidPassword) {
      throw new ApiError('Incorrect password', { status: 401 })
    }
    req.session.user = pick(user, ['email', 'id', 'name'])
    return user
  })
}
