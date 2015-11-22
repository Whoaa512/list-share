#!/usr/bin/env node
;(function (root) {
  /* Prefer bluebird for Promise */
  root.Promise = require('bluebird')

  if (process.env.NODE_ENV !== 'production') {
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
