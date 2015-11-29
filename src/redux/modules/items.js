import get from 'lodash.get'

const STATE_PATH = 'items'

const LOAD = 'list-share/items/LOAD'
const LOAD_SUCCESS = 'list-share/items/LOAD_SUCCESS'
const LOAD_FAIL = 'list-share/items/LOAD_FAIL'

const initialState = {
  loaded: false
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
        data: {
          ...state.data,
          ...action.result
        }
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

export function isLoaded (globalState) {
  return get(globalState, `${STATE_PATH}.loaded`, false)
}

export function getError (globalState) {
  return get(globalState, `${STATE_PATH}.error`, {})
}

export function getItems (globalState) {
  return get(globalState, `${STATE_PATH}.data`, {})
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
