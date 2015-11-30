import memoize from 'lru-memoize'
import {
  createValidator,
  required,
  validUrl
} from 'utils/validation'

const addItemValidation = createValidator({
  link: validUrl,
  imageUrl: validUrl,
  title: required
})
export default memoize(10)(addItemValidation)
