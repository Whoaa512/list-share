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

export function upsertListItems (items) {
  const updatedItems = items.filter(x => x.id != null)
  const newItems = items.filter(x => x.id == null).map(createListItem)
  const allItems = updatedItems.concat(newItems)
  itemsCollection.update(updatedItems)
  itemsCollection.insert(newItems)
  return allItems
}
