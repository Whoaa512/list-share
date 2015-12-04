/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import createHistory from 'history/lib/createBrowserHistory'
import useScroll from 'scroll-behavior/lib/useStandardScroll'
import createStore from './redux/create'
import ApiClient from './helpers/ApiClient'
import io from 'socket.io-client'
import { Provider } from 'react-redux'
import { reduxReactRouter, ReduxRouter } from 'redux-router'

import getRoutes from './routes'
import makeRouteHooksSafe from './helpers/makeRouteHooksSafe'

const client = new ApiClient()
// Expose the instance so we can require it from other files
ApiClient.client = client

// Three different types of scroll behavior available.
// Documented here: https://github.com/rackt/scroll-behavior
const scrollablehistory = useScroll(createHistory)

const dest = document.getElementById('content')
const seedData = window.__data
const store = createStore(reduxReactRouter, makeRouteHooksSafe(getRoutes), scrollablehistory, client, seedData)
clearSeedData()

function clearSeedData () {
  window.__data = null
  const seedScript = document.getElementById('seed-data')
  seedScript.innerHTML = ''
}

function initSocket () {
  const socket = io('', {path: '/api/ws', transports: ['polling']})
  socket.on('news', (data) => {
    console.log(data)
    socket.emit('my other event', { my: 'data from client' })
  })
  socket.on('msg', (data) => {
    console.log(data)
  })

  return socket
}

global.socket = initSocket()

const component = (
<ReduxRouter routes={getRoutes(store)} />
)

ReactDOM.render(
  <Provider store={store} key='provider'>
    {component}
  </Provider>,
  dest
)

if (process.env.NODE_ENV !== 'production') {
  window.React = React // enable debugger

  if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.')
  }
}

if (__DEVTOOLS__) {
  const DevTools = require('./containers/DevTools/DevTools')
  ReactDOM.render(
    <Provider store={store} key='provider'>
      <div>
        {component}
        <DevTools />
      </div>
    </Provider>,
    dest
  )
}
