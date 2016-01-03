import get from 'lodash.get'
import merge from 'lodash.merge'
import { getMyList, getList } from './lists'

const STATE_PATH = 'items'

const LOAD = 'list-share/items/LOAD'
const LOAD_SUCCESS = 'list-share/items/LOAD_SUCCESS'
const LOAD_FAIL = 'list-share/items/LOAD_FAIL'
const UPDATE = 'list-share/items/UPDATE'
const UPDATE_SUCCESS = 'list-share/items/UPDATE_SUCCESS'
const UPDATE_FAIL = 'list-share/items/UPDATE_FAIL'

const initialState = {
  loaded: false,
  udpated: false
}

export default function items (state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true,
        loaded: false
      }
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: merge({}, state.data, action.result)
      }
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      }
    case UPDATE:
      return {
        ...state,
        updating: true,
        updated: false
      }
    case UPDATE_SUCCESS:
      return {
        ...state,
        updating: false,
        updated: true,
        data: merge({}, state.data, action.result)
      }
    case UPDATE_FAIL:
      return {
        ...state,
        updating: false,
        updated: false,
        error: action.error
      }
    default:
      return state
  }
}

export function isLoaded (globalState) {
  return get(globalState, `${STATE_PATH}.loaded`, false)
}

export function getError (globalState) {
  return get(globalState, `${STATE_PATH}.error`, {})
}

export function getItems (globalState) {
  return get(globalState, `${STATE_PATH}.data`, {})
}

export function getListItems (globalState, listId) {
  const list = getList(globalState, listId)
  const allItems = getItems(globalState)
  return list.items.map(id => allItems[id])
}

export function getMyItems (globalState) {
  const myList = getMyList(globalState)
  const allItems = getItems(globalState)
  return myList.items.map(id => allItems[id])
}

export function load (itemIds = 'all') {
  const all = itemIds === 'all'
  const url = `/items/load${all ? '/all' : ''}`
  const body = all ? undefined : {
    data: { itemIds }
  }
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.post(url, body)
  }
}

export function update (item) {
  return {
    types: [UPDATE, UPDATE_SUCCESS, UPDATE_FAIL],
    promise: (client) => client.post('/items/update', {
      data: { item }
    })
  }
}
