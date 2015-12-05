import ApiError from 'utils/ApiError'
import bcrypt, { saltRounds } from 'utils/bcrypt-as-promised'
import uuid from 'uuid'
import { db, dbCatch, usersCollection } from 'utils/db-collections'
import { create as createList } from 'actions/list/index'

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
          return userObj
        })
        .catch(dbCatch(`User id: ${userObj.id}`, { userObj }, 'User to be created'))
      })
      .then(userObj => {
        return createFirstList(userObj.id, userObj.name)
      })
    )
  })
}

function createFirstList (userId, name = '') {
  const [firstName] = name.split(' ')
  const body = {
    items: [],
    userId,
    title: `${firstName}'s Christmas List`
  }

  return createList({ body })
}
