import ApiError from 'utils/ApiError'
import isEmpty from 'lodash.isempty'
import includes from 'lodash.includes'
import logger from 'utils/api-logger'
import { itemsCollection } from 'utils/db-collections'

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

    logger.info({ itemInDb, item }, 'Updating item')
    Object.assign(itemInDb, item)

    resolve({
      [item.id]: itemInDb
    })
  })
}
