import analytics from 'helpers/analytics'
import get from 'lodash.get'

const STATE_PATH = 'signup'

const SUBMIT = 'list-share/signup/SUBMIT'
const SUBMIT_SUCCESS = 'list-share/signup/SUBMIT_SUCCESS'
const SUBMIT_FAIL = 'list-share/signup/SUBMIT_FAIL'

const initialState = {
  submitted: false
}

export default function signup (state = initialState, action = {}) {
  switch (action.type) {
    case SUBMIT:
      return {
        ...state,
        submitting: true
      }
    case SUBMIT_SUCCESS:
      return {
        ...state,
        submitting: false,
        submitted: true,
        data: action.result
      }
    case SUBMIT_FAIL:
      return {
        ...state,
        submitting: false,
        submitted: false,
        error: action.error
      }
    default:
      return state
  }
}

export function isSubmitted (globalState) {
  return get(globalState, `${STATE_PATH}.submitted`, false)
}

export function submit (data) {
  return {
    types: [SUBMIT, SUBMIT_SUCCESS, SUBMIT_FAIL],
    promise: (client) => {
      client.post('/users/create', {
        data
      })
      .then(user => {
        analytics.send({
          hitType: 'event',
          eventCategory: 'Auth',
          eventAction: 'signup',
          eventLabel: 'Signup successful'
        })
        return user
      })
    }
  }
}
