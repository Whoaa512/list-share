#!/usr/bin/env node
var path = require('path')
var isProd = process.env.NODE_ENV === 'production'
var envPath = path.join(__dirname, '../../.env')
var dotenv = require('dotenv')
dotenv.config({
  path: envPath,
  silent: !isProd
})

require('../server.babel') // babel registration (runtime transpilation for node)
var rootDir = path.resolve(__dirname, '..')
;(function (root) {
  /**
   * Define isomorphic constants.
   */
  global.__CLIENT__ = false
  global.__SERVER__ = true
  global.__DISABLE_SSR__ = false // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
  global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production'

  if (process.env.IRON_NODE == null && __DEVELOPMENT__) {
    var pipingOpts = {
      hook: true,
      ignore: /(\/\.|~$|\.json|\.scss$)/i
    }

    // piping returns true when it's ready to run
    if (!require('piping')(pipingOpts)) {
      return
    }
  }

  // https://github.com/halt-hammerzeit/webpack-isomorphic-tools
  var WebpackIsomorphicTools = require('webpack-isomorphic-tools')
  global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../webpack/webpack-isomorphic-tools'))
    .development(__DEVELOPMENT__)
    .server(rootDir, function () {
      require('../src/server')
    })
})(global)
