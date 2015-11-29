import get from 'lodash.get'
import find from 'lodash.find'
import { getUserId } from './auth'

const STATE_PATH = 'lists'

const CREATE = 'list-share/lists/CREATE'
const CREATE_SUCCESS = 'list-share/lists/CREATE_SUCCESS'
const CREATE_FAIL = 'list-share/lists/CREATE_FAIL'
const LOAD = 'list-share/lists/LOAD'
const LOAD_SUCCESS = 'list-share/lists/LOAD_SUCCESS'
const LOAD_FAIL = 'list-share/lists/LOAD_FAIL'

const initialState = {
  created: false,
  loaded: false
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
    default:
      return state
  }
}

function addList (newList, currentlists) {
  return {
    ...currentlists,
    [newList.id]: newList
  }
}

export function getLists (globalState) {
  return get(globalState, `${STATE_PATH}.lists`, {})
}

export function getMyList (globalState) {
  const userId = getUserId(globalState)
  if (!userId) {
    return false
  }
  const lists = getLists(globalState)
  return find(lists, { creator: userId })
}

export function create (data, userId) {
  return {
    types: [CREATE, CREATE_SUCCESS, CREATE_FAIL],
    promise: (client) => client.post('/list/create', {
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
