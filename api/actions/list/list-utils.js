import isEmpty from 'lodash/isEmpty'
import logger from 'utils/api-logger'
import { itemsCollection } from 'utils/db-collections'
import uuid from 'uuid'

export function createListItem (raw) {
  return {
    checked: false,
    checkedBy: '',
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
  logger.debug({
    itemsIdsRemoved: items.map(x => x.id),
    sizeBefore,
    sizeAfter
  }, 'Removing items')
  return items
}

export function upsertListItems (items) {
  const updatedItems = items.filter(x => x.$loki != null)
  const newItems = items.filter(x => x.id == null).map(createListItem)
  const allItems = updatedItems.concat(newItems)

  if (!isEmpty(updatedItems)) {
    itemsCollection.update(updatedItems)
  }
  if (!isEmpty(newItems)) {
    itemsCollection.insert(newItems)
  }
  return allItems
}
