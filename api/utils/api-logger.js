import bunyan from 'bunyan'
import pkg from '../../package.json'

const pkgName = `${pkg.name} API`

const logger = bunyan.createLogger({ name: pkgName })

export default logger
