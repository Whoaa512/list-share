// Original code based on https://github.com/substack/node-password-reset
// MIT license

var url = require('url')
var EventEmitter = require('events').EventEmitter
var nodemailer = require('nodemailer')
var ent = require('ent')
var logger = require('./utils/api-logger')

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_AUTH
  }
})

module.exports = function (opts) {
  if (typeof opts === 'string') {
    opts = {
      uri: opts
    }
  }

  var reset = new Forgot(opts)

  var self = function (email, cb) {
    var session = reset.generate()
    if (!session) return

    var uri = session.uri = opts.uri + '?' + session.id

    var mailOptions = {
      from: opts.from || 'password-robot@localhost',
      to: email,
      subject: 'Presents for Me Password reset',
      html: [
        'Click this link to reset your password:\r\n',
        '<br>',
        '<a href="' + encodeURI(uri) + '">',
        ent.encode(uri),
        '</a>',
        ''
      ].join('\r\n')
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        if (cb) cb(error)
        delete reset.sessions[session.id]
        return
      }
      cb(null, info)
      logger.debug({response: info.response}, 'Message sent')
    })

    return session
  }

  self.middleware = reset.middleware.bind(reset)

  self.expire = function (id) {
    delete reset.sessions[id]
  }

  return self
}

function Forgot (opts) {
  this.sessions = opts.sessions || {}
  this.mount = url.parse(opts.uri)
  this.mount.port = this.mount.port || 80
}

Forgot.prototype.generate = function () {
  var buf = new Buffer(16)
  for (var i = 0; i < buf.length; i++) {
    buf[i] = Math.floor(Math.random() * 256)
  }
  var id = buf.toString('base64')

  var session = this.sessions[id] = new EventEmitter()
  session.id = id
  return session
}

Forgot.prototype.middleware = function (req, res, next) {
  if (!next) {
    next = function (err) {
      if (err) {
        return res.send(err)
      }
    }
  }

  var u = url.parse('http://' + req.headers.host + req.originalUrl)
  u.port = u.port || 80
  var id = u.query

  if (u.hostname !== this.mount.hostname || parseInt(u.port, 10) !== parseInt(this.mount.port, 10) || u.pathname !== this.mount.pathname) {
    next()
  } else if (!id) {
    res.status(400)
    next(new Error('No auth token specified.'))
  } else if (!this.sessions[id]) {
    res.status(410)
    next(new Error('auth token expired'))
  } else {
    this.sessions[id].emit('request', req, res)
  }
}
