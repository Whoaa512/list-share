import ApiError from 'utils/ApiError'
import { db, dbCatch, listsCollection } from 'utils/db-collections'
import { upsertListItems } from './list-utils'
import uuid from 'uuid'

export default function create (req) {
  return new Promise((resolve, reject) => {
    const {
      items,
      userId
    } = req.body
    const creator = userId
    const existingList = listsCollection.find({ creator })

    if (existingList != null) {
      let errStr = 'Only one list allowed per user.'
      return reject(new ApiError(errStr))
    }

    const newItems = upsertListItems(items)

    let newList = {
      id: uuid.v4(),
      creator,
      createdAt: Date.now(),
      items: newItems.map(item => item.id)
    }

    listsCollection.insert(newList)

    db.saveAsync()
    .then(() => {
      resolve({
        message: 'List created',
        id: newList.id
      })
    })
    .catch(dbCatch(`List id: ${newList.id}`, {
      newList,
      newItems
    }, 'List and items to be added'))
  })
}
