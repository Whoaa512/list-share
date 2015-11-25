import React from 'react'
import { IndexRoute, Route } from 'react-router'
import {
  App,
  Lists,
  Login,
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
      <Route path='login' component={Login}/>
      <Route path='sign-up' component={SignUp}/>

      { /* Catch all route */ }
      <Route path='*' component={NotFound} status={404} />
    </Route>
  )
}
