import isEmpty from 'lodash.isempty'
import logger from 'utils/api-logger'
import { itemsCollection } from 'utils/db-collections'
import uuid from 'uuid'

export function createListItem (raw) {
  return {
    checked: false,
    description: '',
    id: uuid.v4(),
    link: '',
    title: '<Untitled item>',
    ...raw
  }
}

export function removeListItems (items) {
  const sizeBefore = itemsCollection.data.length
  itemsCollection.remove(items)
  const sizeAfter = itemsCollection.data.length
  logger.info({
    items,
    sizeBefore,
    sizeAfter
  }, 'Removing items')
  return items
}

export function upsertListItems (items) {
  const updatedItems = items.filter(x => x.$loki != null)
  const newItems = items.filter(x => x.id == null).map(createListItem)
  const allItems = updatedItems.concat(newItems)

  logger.info({
    allItems,
    updatedItems,
    itemsInDb: itemsCollection.data,
    newItems
  }, 'upsertListItems')

  if (!isEmpty(updatedItems)) {
    itemsCollection.update(updatedItems)
  }
  if (!isEmpty(newItems)) {
    itemsCollection.insert(newItems)
  }
  logger.info({
    itemsInDb: itemsCollection.data
  }, 'upsertListItems after itemsCollection updates')
  return allItems
}
