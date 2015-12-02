import config from '../config'

export const FATAL = true
export const NOT_FATAL = false

const analytics = __CLIENT__ ? window.ga : () => undefined

export const googleAnalyticsCode = __DEVELOPMENT__ ? 'window.ga = function(){};' : `
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
`

export const create = analytics.bind(null, 'create', config.gaUa, 'auto')
export const error = (msg, isFatal) => {
  analytics.bind(null, 'send', 'exception', {
    exDescription: msg,
    exFatal: isFatal
  })
}
export const send = analytics.bind(null, 'send')
export const set = analytics.bind(null, 'set')

export default {
  analytics,
  create,
  error,
  send,
  set
}
