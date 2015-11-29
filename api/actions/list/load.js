import ApiError from 'utils/ApiError'
import indexBy from 'lodash.indexby'
import { listsCollection } from 'utils/db-collections'

export function getList (listId, userId) {
  let list
  if (listId != null) {
    list = listsCollection.findOne({
      id: listId
    })
  } else if (userId != null) {
    list = listsCollection.findOne({
      creator: userId
    })
  }

  return list
}

export default function load (req, params) {
  return new Promise((resolve, reject) => {
    const {
      listId,
      userId
    } = req.body

    const [all] = params
    if (all === 'all') {
      return resolve(indexBy(listsCollection.data, 'id'))
    }

    if (listId == null && userId == null) {
      return reject(new ApiError('Missing list id or user id'))
    }
    const list = getList(listId, userId)
    if (list == null) {
      return reject(new ApiError('No list found for the given parameters'))
    }
    resolve(list)
  })
}
