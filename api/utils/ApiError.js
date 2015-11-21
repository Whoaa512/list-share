export function ApiError (message, errorDetails = {}) {
  if (message instanceof ApiError) {
    return message
  }
  Object.assign(this, errorDetails)
  this.message = message
  this.name = 'ApiError'
  Error.captureStackTrace(this, ApiError)
}
ApiError.prototype = Object.create(Error.prototype)
ApiError.prototype.constructor = ApiError
