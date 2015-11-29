import ApiError from 'utils/ApiError'
import arrayUniq from 'array-uniq'
import cloneDeep from 'lodash.clonedeep'
import { db, dbCatch, listsCollection } from 'utils/db-collections'
import { default as getList } from './load'
import { removeListItems, upsertListItems } from './list-utils'

export function updateList (list, idsToAdd, idsToRemove) {
  const old = cloneDeep(list)
  const remainingItems = list.items.filter(id => {
    return !(idsToRemove.some(x => x === id))
  })
  const newItemIds = arrayUniq(remainingItems.concat(idsToAdd))

  list.items = newItemIds

  listsCollection.update(list)

  return db.saveAsync()
  .catch(dbCatch(`List id: ${list.id}`, {
    old,
    updated: list
  }, 'List to be updated'))
}

export default function update (req) {
  return new Promise((resolve, reject) => {
    const {
      itemsToUpsert,
      itemsToRemove
    } = req.body
    if (itemsToUpsert == null || !Array.isArray(itemsToUpsert)) {
      return reject(new ApiError('Missing items to update list with'))
    }

    const updatedItems = upsertListItems(itemsToUpsert)
    const removedItems = removeListItems(itemsToRemove)

    resolve(
      getList(req)
      .then(list => {
        const idsToAdd = updatedItems.map(x => x.id)
        const idsToRemove = removedItems.map(x => x.id)
        return updateList(list, idsToAdd, idsToRemove)
      })
    )
  })
}
