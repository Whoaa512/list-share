import ApiError from 'utils/ApiError'
import isEmpty from 'lodash.isempty'
import includes from 'lodash.includes'
import { itemsCollection } from 'utils/db-collections'

export function getItems (itemIds) {
  return itemsCollection.where(obj => {
    return includes(itemIds, obj.id)
  })
}

export default function load (req, params) {
  const {
    itemIds
  } = req.body

  const [all] = params

  return new Promise((resolve, reject) => {
    if (all === 'all') {
      return resolve(itemsCollection.data)
    }
    if (!itemIds) {
      return reject(new ApiError('Missing item ids'))
    }
    const items = getItems(itemIds)
    if (isEmpty(items)) {
      return reject(new ApiError('No list found for the given parameters'))
    }
    resolve(items)
  })
}
