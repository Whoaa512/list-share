import ApiError from 'utils/ApiError'
import bcrypt_ from 'bcrypt'
import logger from 'utils/logger'
import Promise from 'bluebird'

export const bcrypt = Promise.promisifyAll(bcrypt_)

export function cryptoCatch (userId) {
  return (err) => {
    let errStr = `Bcrypt error. User id: ${userId}`
    logger.error(err, errStr)
    throw new ApiError(errStr)
  }
}
