import get from 'lodash/get'

const STATE_PATH = 'users'

const LOAD = 'list-share/users/LOAD'
const LOAD_SUCCESS = 'list-share/users/LOAD_SUCCESS'
const LOAD_FAIL = 'list-share/users/LOAD_FAIL'

const initialState = {
  loaded: false
}

export default function users (state = initialState, action = {}) {
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
        data: addUser(action.result, state.data)
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

function addUser (newUser, current) {
  if (newUser.id != null) {
    return {
      ...current,
      [newUser.id]: newUser
    }
  }
  return {
    ...current,
    ...newUser
  }
}

export function isLoaded (globalState) {
  return get(globalState, `${STATE_PATH}.loaded`, false)
}

export function getUsers (globalState) {
  return get(globalState, `${STATE_PATH}.data`, {})
}

export function load (userId = 'all') {
  const all = userId === 'all'
  const url = `/users/load${all ? '/all' : ''}`
  const body = all ? undefined : {
    data: { userId }
  }
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.post(url, body)
  }
}
