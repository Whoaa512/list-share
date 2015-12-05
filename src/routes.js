import React from 'react'
import { Route } from 'react-router'
import {
  getUser,
  isLoaded as isAuthLoaded,
  load as loadAuth
} from './redux/modules/auth'
import {
  AddToList,
  App,
  CreateList,
  EditItem,
  EditList,
  ForgotPassword,
  List,
  Lists,
  Login,
  MyList,
  NotFound,
  SignUp
} from 'containers'

export default (store) => {
  const checkAuth = (replaceState, cb) => {
    const isLoggedIn = getUser(store.getState())
    if (!isLoggedIn) {
      replaceState(null, '/login')
    }
    cb()
  }

  const requireLogin = (nextState, replaceState, cb) => {
    const current = store.getState()
    if (!isAuthLoaded(current)) {
      store.dispatch(loadAuth())
      .finally(() => checkAuth(replaceState, cb))
    } else {
      checkAuth(replaceState, cb)
    }
  }
  /**
   * Please keep routes in alphabetical order
   */
  return (
  <Route component={App}>
      { /* Home (main) route */ }

      <Route onEnter={requireLogin}>
        <Route path='/' component={Lists}/>
        { /* Routes */ }
        <Route path='create-list' component={CreateList}/>
        <Route path='item/:itemId/edit' component={EditItem}/>
        <Route path='list/:listId' component={List}/>
        <Route path='my-list' component={MyList}/>
        <Route path='my-list/add' component={AddToList}/>
        <Route path='my-list/edit' component={EditList}/>
      </Route>

      <Route path='/forgot-password' component={ForgotPassword}/>
      <Route path='login' component={Login}/>
      <Route path='sign-up' component={SignUp}/>

      { /* Catch all route */ }
      <Route path='*' component={NotFound} status={404} />
    </Route>
  )
}
