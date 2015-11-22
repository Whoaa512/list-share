import ApiError from 'utils/ApiError'
import bcrypt_ from 'bcrypt'
import logger from 'utils/logger'
import Promise from 'bluebird'
import uuid from 'uuid'
import { db, usersCollection } from 'utils/db-collections'

const bcrypt = Promise.promisifyAll(bcrypt_)

export default function create (req) {
  return new Promise((resolve, reject) => {
    const {
      name,
      email,
      password
    } = req.body

    if (name == null || email == null || password == null) {
      reject(new ApiError('Missing email, name, or password'))
    }

    resolve(
      bcrypt.hashAsync(password, 10)
      .then(hash => {
        return {
          email,
          id: uuid.v4(),
          name,
          passwordHash: hash
        }
      })
      .then(userObj => {
        usersCollection.insert(userObj)
        return db.saveAsync()
        .then(() => {
          resolve({
            email,
            id: userObj.id,
            message: 'User created',
            name
          })
        })
        .catch(dbError => {
          let errStr = `Error trying to save db. User id: ${userObj.id}`
          logger.error(dbError, errStr)
          logger.info({ userObj }, 'User to be created')
          throw new ApiError(errStr)
        })
      })
    )
  })
}
