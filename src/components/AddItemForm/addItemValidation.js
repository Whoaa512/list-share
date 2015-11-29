import memoize from 'lru-memoize'
import {
  createValidator,
  required
} from 'utils/validation'

const addItemValidation = createValidator({
  title: required
})
export default memoize(10)(addItemValidation)
