#!/usr/bin/env node
;(function (root) {
  var path = require('path')
  var isProd = process.env.NODE_ENV === 'production'
  var envPath = path.join(__dirname, '../../.env')
  var dotenv = require('dotenv')
  dotenv.config({
    path: envPath,
    silent: !isProd
  })

  if (process.env.IRON_NODE == null && process.env.NODE_ENV !== 'production') {
    var pipingOpts = {
      hook: true,
      ignore: /(\/\.|~$|\.json|\.scss$)/i
    }

    // piping returns true when it's ready to run
    if (!require('piping')(pipingOpts)) {
      return
    }
  }

  require('../server.babel') // babel registration (runtime transpilation for node)
  require('../api/api')
})(global)
