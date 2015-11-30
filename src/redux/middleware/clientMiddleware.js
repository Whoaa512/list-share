export default function clientMiddleware (client) {
  return ({dispatch, getState}) => {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState)
      }

      const { promise, types, ...rest } = action
      if (!promise) {
        return next(action)
      }

      const [REQUEST, SUCCESS, FAILURE] = types
      next({...rest, type: REQUEST})
      return promise(client)
      .then(result => {
        dispatch({...rest, result, type: SUCCESS})
        return Promise.resolve(result)
      })
      .catch(error => {
        dispatch({...rest, error, type: FAILURE})
        if (__CLIENT__) {
          return Promise.reject(error)
        }
      })
    }
  }
}
