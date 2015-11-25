import ApiError from 'utils/ApiError'
import { usersCollection } from 'utils/db-collections'

export function getUser (email, userId) {
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

export default function load (req) {
  return new Promise((resolve, reject) => {
    const {
      email,
      userId
    } = req.body

    if (email == null || userId == null) {
      return reject(new ApiError('Missing email or user id'))
    }

    const user = getUser(email, userId)
    if (user == null) {
      return new ApiError('No user found for the given parameters')
    }

    resolve(user)
  })
}
