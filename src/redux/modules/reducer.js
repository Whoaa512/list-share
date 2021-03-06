import { combineReducers } from 'redux'
import multireducer from 'multireducer'
import { routerStateReducer } from 'redux-router'

import auth from './auth'
import counter from './counter'
import {reducer as form} from 'redux-form'
import info from './info'
import items from './items'
import listMeta from './listMeta'
import lists from './lists'
import signup from './signup'
import users from './users'
import widgets from './widgets'

export default combineReducers({
  router: routerStateReducer,
  auth,
  form,
  multireducer: multireducer({
    counter1: counter,
    counter2: counter,
    counter3: counter
  }),
  info,
  items,
  listMeta,
  lists,
  signup,
  users,
  widgets
})
