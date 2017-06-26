import { createStructuredSelector } from 'reselect'

import getSignInError from './getSignInError'

export default createStructuredSelector({
  error: getSignInError
})
