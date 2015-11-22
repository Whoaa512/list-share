import bcrypt_ from 'bcrypt'
import Promise from 'bluebird'

export const bcrypt = Promise.promisifyAll(bcrypt_)
