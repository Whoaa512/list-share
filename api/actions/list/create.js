import ApiError from 'utils/ApiError'
import { db, listsCollection } from 'utils/db-collections'
import logger from 'utils/logger'
import uuid from 'uuid'

export default function create (req) {
  return new Promise((resolve, reject) => {
    const {
      items,
      userId,
      username
    } = req.body

    let newList = {
      id: uuid.v4(),
      creator: userId || username,
      createdAt: Date.now(),
      items: items.map(createListItem)
    }

    listsCollection.insert(newList)

    db.saveAsync()
    .then(() => {
      resolve({
        message: 'List created',
        id: newList.id
      })
    })
    .catch(dbError => {
      let errStr = `Error trying to save db. List id: ${newList.id}`
      logger.error(dbError, errStr)
      logger.info(newList, 'List to be added')
      reject(new ApiError(errStr))
    })
  })
}

function createListItem (raw) {
  return {
    checked: false,
    description: '',
    link: '',
    title: '<Untitled item>',
    ...raw
  }
}
