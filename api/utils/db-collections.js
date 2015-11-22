import ApiError from 'utils/ApiError'
import logger from 'utils/logger'
import Lokijs from 'lokijs'
import Promise from 'bluebird'

export const db = Promise.promisifyAll(new Lokijs('list-share-db.json', { autoload: true, autoloadCallback: autoloadCb }))
export let listsCollection = { data: [] }
export let itemsCollection = { data: [] }
export let usersCollection = { data: [] }

export function dbCatch (idStr, ...infoArgs) {
  return (dbError) => {
    let errStr = `Error trying to save db. ${idStr}`
    logger.error(dbError, errStr)
    if (infoArgs.length > 0) {
      logger.info.apply(logger, infoArgs)
    }
    throw new ApiError(errStr)
  }
}

function autoloadCb (error) {
  collectionSetup()
  if (error) {
    if (/ENOENT/i.test(error.message)) {
      logger.info('No db file found! Creating one...')
      db.saveAsync().catch(function (dbError) {
        logger.error(dbError, 'Error trying to save a freshly created db.')
      })
    } else {
      logger.error(error, 'autoload error')
    }
  }
}

function collectionSetup (argument) {
  const allLists = 'allLists'
  const allItems = 'allItems'
  const allUsers = 'allUsers'
  listsCollection = db.getCollection(allLists) || db.addCollection(allLists)
  itemsCollection = db.getCollection(allItems) || db.addCollection(allItems)
  usersCollection = db.getCollection(allUsers) || db.addCollection(allUsers)
}
