import memoize from 'lru-memoize'
import {
  createValidator,
  required,
  validUrl
} from 'utils/validation'

const itemValidation = createValidator({
  link: validUrl,
  title: required
})
export default memoize(10)(itemValidation)
