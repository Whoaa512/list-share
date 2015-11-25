import ApiError from './ApiError'
import bcrypt_ from 'bcrypt'
import logger from './api-logger'
import Promise from 'bluebird'

export const saltRounds = 10

export default Promise.promisifyAll(bcrypt_)

export function cryptoCatch (userId) {
  return (err) => {
    let errStr = `Bcrypt error. User id: ${userId}`
    logger.error(err, errStr)
    throw new ApiError(errStr)
  }
}
