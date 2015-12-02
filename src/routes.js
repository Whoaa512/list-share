import React from 'react'
import { IndexRoute, Route } from 'react-router'
import {
  AddToList,
  App,
  CreateList,
  EditItem,
  EditList,
  List,
  Lists,
  Login,
  MyList,
  NotFound,
  SignUp
} from 'containers'

export default (store) => {
  /**
   * Please keep routes in alphabetical order
   */
  return (
  <Route path='/' component={App}>
      { /* Home (main) route */ }
      <IndexRoute component={Lists}/>

      { /* Routes */ }
      <Route path='create-list' component={CreateList}/>
      <Route path='item/:itemId/edit' component={EditItem}/>
      <Route path='list/:listId' component={List}/>
      <Route path='login' component={Login}/>
      <Route path='my-list' component={MyList}/>
      <Route path='my-list/add' component={AddToList}/>
      <Route path='my-list/edit' component={EditList}/>
      <Route path='sign-up' component={SignUp}/>

      { /* Catch all route */ }
      <Route path='*' component={NotFound} status={404} />
    </Route>
  )
}
