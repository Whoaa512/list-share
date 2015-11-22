import ApiError from 'utils/ApiError'
import bcrypt, { saltRounds } from 'utils/bcrypt-as-promised'
import cloneDeep from 'clone-deep'
import login from 'actions/login'
import { db, dbCatch, usersCollection } from 'utils/db-collections'

export function updateUser (user, name, newEmail, newPassword) {
  const old = cloneDeep(user)

  if (name != null) {
    user.name = name
  }

  if (newEmail != null) {
    user.email = newEmail
  }

  let passwordChange = Promise.resolve(user)
  if (newPassword != null) {
    passwordChange = bcrypt.hashAsync(newPassword, saltRounds)
    .then(newHash => {
      user.passwordHash = newHash
      return user
    })
  }

  return passwordChange()
  .then(user => {
    usersCollection.update(user)

    return db.saveAsync()
    .catch(dbCatch(`User id: ${user.id}`, { old, updated: user }, 'User to be updated'))
  })
}

export default function update (req) {
  return new Promise((resolve, reject) => {
    const {
      name,
      newEmail,
      newPassword
    } = req.body

    if (name == null || newEmail == null || newPassword == null) {
      reject(new ApiError('Missing a value to update'))
    }

    resolve(
      login(req)
      .then(user => {
        return updateUser(user, name, newEmail, newPassword)
      })
    )
  })
}
