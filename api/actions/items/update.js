import ApiError from 'utils/ApiError'
import cloneDeep from 'lodash/cloneDeep'
import isEmpty from 'lodash/isEmpty'
import includes from 'lodash/includes'
import logger from 'utils/api-logger'
import { db, dbCatch, itemsCollection } from 'utils/db-collections'

export function getItems (itemIds) {
  return itemsCollection.where(obj => {
    return includes(itemIds, obj.id)
  })
}

export default function update (req, params) {
  return new Promise((resolve, reject) => {
    const {
      item,
      itemIds
    } = req.body

    if (!isEmpty(itemIds)) {
      return reject(new ApiError('Only one item can be updated'))
    }
    if (isEmpty(item)) {
      return reject(new ApiError('Missing item to update'))
    }

    const itemInDb = itemsCollection.findOne({ id: item.id })
    if (isEmpty(itemInDb)) {
      return reject(new ApiError('No item exists with that id'))
    }

    const old = cloneDeep(itemInDb)
    logger.debug({ itemInDb, item }, 'Updating item')
    Object.assign(itemInDb, item)

    const dbSave = db.saveAsync()
    .catch(dbCatch(`Item id: ${item.id}`, {
      old,
      updated: item
    }, 'List to be updated'))
    .then(() => {
      return {
        [item.id]: itemInDb
      }
    })

    resolve(dbSave)
  })
}
