import get from 'lodash.get'
import isEmpty from 'lodash.isempty'
import cloneDeep from 'lodash.clonedeep'
import { getUser } from './auth'

const STATE_PATH = 'listMeta'

const LOAD = `list-share/${STATE_PATH}/LOAD`
const LOAD_SUCCESS = `list-share/${STATE_PATH}/LOAD_SUCCESS`
const LOAD_FAIL = `list-share/${STATE_PATH}/LOAD_FAIL`
const UPDATE = `list-share/${STATE_PATH}/UPDATE`
const UPDATE_SUCCESS = `list-share/${STATE_PATH}/UPDATE_SUCCESS`
const UPDATE_FAIL = `list-share/${STATE_PATH}/UPDATE_FAIL`

const initialState = {
  loaded: false
}

export default function reducer (state = initialState, action = {}) {
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
        data: action.result
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
        data: action.result
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

export function getData (globalState) {
  return get(globalState, `${STATE_PATH}.data`, {})
}

export function getError (globalState) {
  return get(globalState, `${STATE_PATH}.error`, {})
}

export function load () {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/listMeta/load')
  }
}

export function loadListMetaFromLocal () {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client, getState) => {
      return new Promise((resolve, reject) => {
        let { listMeta } = getUser(getState())
        listMeta = cloneDeep(listMeta)
        if (isEmpty(listMeta)) {
          return reject(new Error('Local list meta not found.'))
        }
        resolve(listMeta)
      })
    }
  }
}

export function update (data) {
  return {
    types: [UPDATE, UPDATE_SUCCESS, UPDATE_FAIL],
    promise: (client) => client.post('/listMeta/update', { data })
  }
}
