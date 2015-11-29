import ApiError from 'utils/ApiError'
import bcrypt, { cryptoCatch } from 'utils/bcrypt-as-promised'
import logger from 'utils/api-logger'
import { default as loadUser } from './users/load'

export default function login (req) {
  const {
    email,
    password
  } = req.body

  if (email == null || password == null) {
    return Promise.reject(new ApiError('Missing email, password'))
  }

  const INTERNAL = true

  return loadUser(req, [], INTERNAL)
  .then(user => {
    const isValidPassword = bcrypt.compareAsync(password, user.passwordHash)
    .catch(cryptoCatch(user.id))
    return [user, isValidPassword]
  })
  .spread((user, isValidPassword) => {
    if (!isValidPassword) {
      throw new ApiError('Incorrect password', { status: 401 })
    }
    const save = Promise.promisify(req.session.save.bind(req.session))
    req.session.user = user
    return [user, save()]
  })
  .spread(user => user)
  .catch(error => {
    logger.error(error, 'Problem saving session')
    throw new ApiError('Problem saving session')
  })
}
