import ApiError from 'utils/ApiError'
import logger from 'utils/api-logger'
import get from 'lodash.get'
import merge from 'lodash.merge'
import cloneDeep from 'lodash.clonedeep'
import { db, dbCatch } from 'utils/db-collections'
import { getUser } from 'actions/users/load'
import { default as loadListMeta } from './load'

function updateListMeta (listMeta, newData, userId, req) {
  const old = cloneDeep(listMeta)
  const user = getUser(undefined, userId)
  const updated = merge({}, listMeta, newData)
  if (user == null) {
    throw new ApiError(`No user with that id: ${userId}`)
  }
  user.listMeta = updated

  const dbSave = db.saveAsync()
  .catch(dbCatch(`User id id: ${userId}`, {
    old,
    newData,
    updated: updated
  }, 'listMeta to be updated'))
  .then(() => {
    const save = Promise.promisify(req.session.save.bind(req.session))
    const sessionSave = save().catch(error => {
      logger.error(error, 'Problem saving session')
    })
    req.session.user = user
    return sessionSave
  })

  return [updated, dbSave]
}

export default function update (req) {
  return new Promise((resolve, reject) => {
    const newData = req.body
    const userId = get(req, 'session.user.id', 'not found')

    resolve(
      loadListMeta(req).then(listMeta => {
        logger.debug({ listMeta, newData, userId }, 'got meta')
        return updateListMeta(listMeta, newData, userId, req)
      })
      .spread(updatedMeta => {
        logger.debug({ updatedMeta, userId }, 'List meta updated')
        return updatedMeta
      })
      .catch(err => {
        err.userId = userId
        logger.error(err, 'Error updating meta')
        throw new ApiError(err.message)
      })
    )
  })
}
