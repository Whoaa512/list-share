import ApiError from 'utils/ApiError'
import { db, dbCatch, listsCollection } from 'utils/db-collections'
import { upsertListItems } from './list-utils'
import uuid from 'uuid'

export default function create (req) {
  return new Promise((resolve, reject) => {
    const {
      items = [],
      title,
      userId
    } = req.body
    const creator = userId
    const existingList = listsCollection.findOne({ creator })

    if (existingList != null) {
      let errStr = 'Only one list allowed per user.'
      return reject(new ApiError(errStr))
    }

    const newItems = upsertListItems(items)

    let newList = {
      id: uuid.v4(),
      creator,
      title,
      createdAt: Date.now(),
      items: newItems.map(item => item.id)
    }

    listsCollection.insert(newList)

    db.saveAsync()
    .then(() => {
      resolve(newList)
    })
    .catch(dbCatch(`List id: ${newList.id}`, {
      newList,
      newItems
    }, 'List and items to be added'))
  })
}
