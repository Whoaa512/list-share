import analytics from 'helpers/analytics'
import cloneDeep from 'lodash.clonedeep'
import get from 'lodash.get'
import find from 'lodash.find'
import { getMyItems } from './items'
import { getUserId } from './auth'

const STATE_PATH = 'lists'

const CREATE = 'list-share/lists/CREATE'
const CREATE_SUCCESS = 'list-share/lists/CREATE_SUCCESS'
const CREATE_FAIL = 'list-share/lists/CREATE_FAIL'
const LOAD = 'list-share/lists/LOAD'
const LOAD_SUCCESS = 'list-share/lists/LOAD_SUCCESS'
const LOAD_FAIL = 'list-share/lists/LOAD_FAIL'
const UPDATE = 'list-share/lists/UPDATE'
const UPDATE_SUCCESS = 'list-share/lists/UPDATE_SUCCESS'
const UPDATE_FAIL = 'list-share/lists/UPDATE_FAIL'

const initialState = {
  created: false,
  loaded: false,
  updated: false
}

export default function lists (state = initialState, action = {}) {
  switch (action.type) {
    case CREATE:
      return {
        ...state,
        creating: true
      }
    case CREATE_SUCCESS:
      return {
        ...state,
        creating: false,
        created: true,
        lists: addList(action.result, state.lists)
      }
    case CREATE_FAIL:
      return {
        ...state,
        creating: false,
        created: false,
        error: action.error
      }
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
        lists: addList(action.result, state.lists)
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
        lists: addList(action.result, state.lists)
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

function addList (newList, currentlists) {
  if (newList.id != null) {
    return {
      ...currentlists,
      [newList.id]: newList
    }
  }
  return {
    ...currentlists,
    ...newList
  }
}

export function isLoaded (globalState) {
  return get(globalState, `${STATE_PATH}.loaded`, false)
}

export function getLists (globalState) {
  return get(globalState, `${STATE_PATH}.lists`, {})
}

export function getList (globalState, listId) {
  return get(globalState, `${STATE_PATH}.lists.${listId}`, { items: [] })
}

export function userHasList (globalState) {
  return !!(getMyList(globalState).id)
}

export function getMyList (globalState) {
  const userId = getUserId(globalState)
  if (!userId) {
    return { items: [] }
  }
  const lists = getLists(globalState)
  return find(lists, { creator: userId }) || { items: [] }
}

export function getMyListAndItems (globalState) {
  const myList = cloneDeep(getMyList(globalState))
  const myItems = getMyItems(globalState)
  myList.itemIds = myList.items
  myList.items = myItems
  return myList
}

export function create (data, userId) {
  return {
    types: [CREATE, CREATE_SUCCESS, CREATE_FAIL],
    promise: (client) => {
      client.post('/list/create', {
        data: { ...data, userId }
      })
      .then(list => {
        analytics.send({
          hitType: 'event',
          eventCategory: 'List',
          eventAction: 'create',
          eventLabel: 'List created'
        })
        return list
      })
    }
  }
}

export function update (data, userId) {
  return {
    types: [UPDATE, UPDATE_SUCCESS, UPDATE_FAIL],
    promise: (client) => client.post('/list/update', {
      data: { ...data, userId }
    })
  }
}

export function load (listId, all) {
  const url = `/list/load${all ? '/all' : ''}`
  const body = all ? undefined : {
    data: { listId }
  }
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.post(url, body)
  }
}
