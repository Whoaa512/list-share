'use strict'

import * as actions from './actions/index'
import bodyParser from 'body-parser'
import config from '../src/config'
import express from 'express'
import fs from 'fs'
import http from 'http'
import logger from 'utils/api-logger'
import omit from 'lodash.omit'
import passwordReset from './reset-password'
import PrettyError from 'pretty-error'
import session from 'express-session'
import SocketIo from 'socket.io'
import { mapUrl } from 'utils/url'
import { getUser } from 'actions/users/load'
import { updateUser } from 'actions/users/update'

const FileStore = require('session-file-store')(session)
const pretty = new PrettyError()
const app = express()

const server = new http.Server(app)

const io = new SocketIo(server)
io.path('/ws')

// create reusable transporter object using SMTP transport

const host = process.env.NODE_ENV === 'production' ? 'presentsfor.me' : 'localhost'
const forgot = passwordReset({
  uri: `http://${host}:3030/password_reset`,
  from: 'password-robot@presentsfor.me'
})

app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: new FileStore({
    logFn: logger.debug
  }),
  unset: 'destroy',
  cookie: { maxAge: 3600000 }
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(forgot.middleware)

app.post('/forgot', (req, res) => {
  let { email } = req.body
  email = email.trim().toLowerCase()
  const reset = forgot(email, (err) => {
    if (err) {
      res.status(500)
      res.json({ message: 'Error sending message: ' + err })
    } else {
      res.status(200)
      res.json({ message: 'Check your inbox for a password reset message.' })
    }
  })
  reset.on('request', (req_, res_) => {
    req_.session.reset = { email, id: reset.id }
    fs.createReadStream(__dirname + '/forgot.html').pipe(res_)
  })
})

app.post('/reset', (req, res) => {
  if (!req.session.reset) {
    res.status(500)
    return res.json({message: 'Reset token not set properly, please try again.'})
  }

  const password = req.body.password
  const confirm = req.body.confirm
  if (password !== confirm) {
    res.status(500)
    return res.end({ message: 'Passwords do not match' })
  }

  // update the user db here
  const user = getUser(req.session.reset.email)

  updateUser(user, null, null, password)
  .then(() => {
    forgot.expire(req.session.reset.id)
    delete req.session.reset
    const port = process.env.NODE_ENV === 'production' ? '' : ':3000'
    res.redirect(`http://${host + port}/login`)
  })
})

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
