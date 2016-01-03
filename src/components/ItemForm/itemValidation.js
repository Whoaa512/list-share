import memoize from 'lru-memoize'
import {
  createValidator,
  required,
  validImage,
  validUrl
} from 'utils/validation'

const itemValidation = createValidator({
  link: validUrl,
  imageUrl: validImage,
  title: required
})
export default memoize(10)(itemValidation)
