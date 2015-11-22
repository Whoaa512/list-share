import ApiError from 'utils/ApiError'
import { listsCollection } from 'utils/db-collections'

export function getList (req) {
  const {
    listId,
    userId
  } = req.body

  let list
  if (listId != null) {
    list = listsCollection.find({
      id: listId
    })
  } else if (userId != null) {
    list = listsCollection.find({
      creator: userId
    })
  } else {
    return new ApiError('Missing list id or user id')
  }

  if (list == null) {
    return new ApiError('No list found for the given parameters')
  }

  return list
}

export default function load (req) {
  return new Promise((resolve, reject) => {
    const list = getList(req)
    if (list instanceof ApiError) {
      return reject(list)
    }
    resolve(list)
  })
}
