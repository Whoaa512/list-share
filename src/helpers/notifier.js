import { _notifier } from 'react-notification-system'

export function error (message = 'Something went wrong!', autoDismiss = 3) {
  _notifier.addNotification({
    position: 'tc',
    autoDismiss,
    message,
    level: 'error'
  })
}

export function success (message = 'Thanks!', autoDismiss = 3) {
  _notifier.addNotification({
    position: 'tc',
    autoDismiss,
    message,
    level: 'success'
  })
}
