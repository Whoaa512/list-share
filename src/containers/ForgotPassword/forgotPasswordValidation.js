import memoize from 'lru-memoize'
import {
  createValidator,
  email,
  required
} from 'utils/validation'

const forgotPasswordValidation = createValidator({
  email: [required, email]
})
export default memoize(10)(forgotPasswordValidation)
