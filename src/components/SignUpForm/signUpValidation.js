import memoize from 'lru-memoize'
import {
  createValidator,
  email,
  maxLength,
  minLength,
  required
} from 'utils/validation'

const signUpValidation = createValidator({
  name: [required, maxLength(30)],
  email: [required, email],
  password: [required, minLength(8)]
})
export default memoize(10)(signUpValidation)
