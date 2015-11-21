import logger from 'utils/logger'
import Lokijs from 'lokjs'
import Promise from 'bluebird'

export const db = Promise.promisifyAll(new Lokijs('list-share-db.json', { autoload: true, autoloadCallback: autoloadCb }))
export let listsCollection = { data: [] }

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
  listsCollection = db.getCollection(allLists) || db.addCollection(allLists)
}
