import ApiError from 'utils/ApiError'
import bcrypt, { saltRounds } from 'utils/bcrypt-as-promised'
import uuid from 'uuid'
import { db, dbCatch, usersCollection } from 'utils/db-collections'

export default function create (req) {
  return new Promise((resolve, reject) => {
    const {
      avatarImg = 'http://gettingreal2014.com/wp-content/uploads/2014/07/default-avatar.png',
      name,
      email,
      password
    } = req.body

    if (name == null || email == null || password == null) {
      reject(new ApiError('Missing email, name, or password'))
    }

    resolve(
      bcrypt.hashAsync(password, saltRounds)
      .then(hash => {
        return {
          avatarImg,
          email: email.trim().toLowerCase(),
          id: uuid.v4(),
          name,
          passwordHash: hash
        }
      })
      .then(userObj => {
        usersCollection.insert(userObj)
        return db.saveAsync()
        .then(() => {
          resolve(userObj)
        })
        .catch(dbCatch(`User id: ${userObj.id}`, { userObj }, 'User to be created'))
      })
    )
  })
}
