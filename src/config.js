require('babel/polyfill')
const uuid = require('uuid')

const environment = {
  development: {
    sessionSecret: 'bacon',
    isProduction: false
  },
  production: {
    sessionSecret: process.env.SESSION_SECRET || uuid.v4() + '-' + uuid.v4() + '-' + uuid.v4(),
    isProduction: true
  }
}[process.env.NODE_ENV || 'development']

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  gaUa: 'UA-70843519-1',
  app: {
    title: 'Presents for Me',
    description: 'Share your Christmas lists!',
    meta: {
      charSet: 'utf-8',
      property: {
        // 'og:site_name': 'React Redux Example',
        // 'og:image': 'https://react-redux.herokuapp.com/logo.jpg',
        // 'og:locale': 'en_US',
        // 'og:title': 'React Redux Example',
        // 'og:description': 'All the modern best practices in one example.',
        // 'twitter:card': 'summary',
        // 'twitter:site': '@erikras',
        // 'twitter:creator': '@erikras',
        // 'twitter:title': 'React Redux Example',
        // 'twitter:description': 'All the modern best practices in one example.',
        // 'twitter:image': 'https://react-redux.herokuapp.com/logo.jpg',
        // 'twitter:image:width': '200',
        // 'twitter:image:height': '200'
      }
    }
  }
}, environment)
