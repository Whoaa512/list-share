'use strict'

import * as actions from './actions/index'
import bodyParser from 'body-parser'
import config from '../src/config'
import express from 'express'
import http from 'http'
import omit from 'lodash.omit'
import PrettyError from 'pretty-error'
import session from 'express-session'
import SocketIo from 'socket.io'
import store from 'loki-session'
import { mapUrl } from 'utils/url'

const pretty = new PrettyError()
const app = express()

const server = new http.Server(app)

const io = new SocketIo(server)
io.path('/ws')

app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: store(__dirname + '/session-db.json'),
  unset: 'destroy',
  cookie: { maxAge: 60000 }
}))
app.use(bodyParser.json())

app.use((req, res) => {
  const splittedUrlPath = req.url.split('?')[0].split('/').slice(1)

  const {action, params} = mapUrl(actions, splittedUrlPath)

  if (action) {
    action(req, params)
      .then((result) => {
        if (result && result.passwordHash != null) {
          result = omit(result, 'passwordHash')
        }
        res.json(result)
      }, (reason) => {
        if (reason && reason.redirect) {
          res.redirect(reason.redirect)
        } else {
          console.error('API ERROR:', pretty.render(reason))
          res.status(reason.status || 500).json(reason)
        }
      })
  } else {
    res.status(404).end('NOT FOUND')
  }
})

const bufferSize = 100
const messageBuffer = new Array(bufferSize)
let messageIndex = 0

if (config.apiPort) {
  const runnable = app.listen(config.apiPort, (err) => {
    if (err) {
      console.error(err)
    }
    console.info('----\n==> 🌎  API is running on port %s', config.apiPort)
    console.info('==> 💻  Send requests to http://%s:%s', config.apiHost, config.apiPort)
  })

  io.on('connection', (socket) => {
    socket.emit('news', {msg: `'Hello World!' from server`})

    socket.on('history', () => {
      for (let index = 0; index < bufferSize; index++) {
        const msgNo = (messageIndex + index) % bufferSize
        const msg = messageBuffer[msgNo]
        if (msg) {
          socket.emit('msg', msg)
        }
      }
    })

    socket.on('msg', (data) => {
      data.id = messageIndex
      messageBuffer[messageIndex % bufferSize] = data
      messageIndex++
      io.emit('msg', data)
    })
  })
  io.listen(runnable)
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified')
}
