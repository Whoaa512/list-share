import ApiError from 'utils/ApiError'
import get from 'lodash/get'
import { getUser } from 'actions/users/load'

export default function load (req) {
  return new Promise((resolve, reject) => {
    const userId = get(req, 'session.user.id', false)
    if (!userId) {
      return reject(new ApiError('Missing session to get user id'))
    }
    const user = getUser(undefined, userId)
    if (user == null) {
      reject(new ApiError(`No user with that id: ${userId}`))
    }
    const listMeta = get(user, 'listMeta', {})
    resolve(listMeta)
  })
}
