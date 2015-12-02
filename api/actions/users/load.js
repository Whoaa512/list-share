import ApiError from 'utils/ApiError'
import indexBy from 'lodash.indexby'
import { usersCollection } from 'utils/db-collections'

export function getUser (email = '', userId) {
  email = email.trim().toLowerCase()
  let user = null

  if (userId != null) {
    user = usersCollection.findOne({
      id: userId
    })
  } else if (email != null) {
    user = usersCollection.findOne({
      email
    })
  }

  return user
}

export default function load (req, params, INTERNAL) {
  return new Promise((resolve, reject) => {
    const {
      email,
      userId
    } = req.body
    const [all] = params

    if (all === 'all') {
      const allUsers = usersCollection.data.map(user => {
        return {
          id: user.id,
          avatarImg: user.avatarImg
        }
      })
      return resolve(indexBy(allUsers, 'id'))
    }

    if (!INTERNAL) {
      return reject(new ApiError('Users are not allowed to be queried.'))
    }

    if (email == null && userId == null) {
      return reject(new ApiError('Missing email or user id'))
    }

    const user = getUser(email, userId)
    if (user == null) {
      return new ApiError('No user found for the given parameters')
    }

    resolve(user)
  })
}
